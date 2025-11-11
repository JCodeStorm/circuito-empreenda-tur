from flask import Blueprint, request, jsonify, session, current_app
from models import db, Course, Certificate, User, EventRegistration
from utils import generate_certificate_pdf, send_certificate_email
import uuid
from datetime import datetime

course_certificate_bp = Blueprint("course_certificate", __name__)

# Helper para verificar se o usuário está logado
def login_required(f):
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized: Login required'}), 401
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    return wrapper

# Rota para criar um novo curso (apenas para administradores, por exemplo)
@course_certificate_bp.route('/courses', methods=['POST'])
@login_required
def create_course():
    # Em um sistema real, você adicionaria verificação de permissão de administrador aqui
    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    event_id = data.get('event_id')
    duration_hours = data.get('duration_hours')
    instructor = data.get('instructor')

    if not all([title, event_id]):
        return jsonify({'message': 'Missing required fields'}), 400

    new_course = Course(title=title, description=description, event_id=event_id,
                        duration_hours=duration_hours, instructor=instructor)
    db.session.add(new_course)
    db.session.commit()
    return jsonify({'message': 'Course created successfully', 'course': new_course.to_dict()}), 201

# Rota para listar todos os cursos
@course_certificate_bp.route('/courses', methods=['GET'])
def get_all_courses():
    courses = Course.query.all()
    return jsonify([course.to_dict() for course in courses]), 200

# Rota para obter detalhes de um curso específico
@course_certificate_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({'message': 'Course not found'}), 404
    return jsonify(course.to_dict()), 200

# Rota para emitir um certificado para um usuário em um curso
@course_certificate_bp.route('/certificates/issue', methods=['POST'])
@login_required
def issue_certificate():
    data = request.get_json()
    user_id = session.get('user_id') # O usuário logado está solicitando/recebendo o certificado
    course_id = data.get('course_id')

    user = User.query.get(user_id)
    course = Course.query.get(course_id)

    if not user or not course:
        return jsonify({'message': 'User or Course not found'}), 404

    # Verificar se o usuário já está registrado no evento associado ao curso
    # Isso é uma simplificação. Em um sistema real, você verificaria a conclusão do curso.
    event_registration = EventRegistration.query.filter_by(user_id=user_id, event_id=course.event_id, status='confirmed').first()
    if not event_registration:
        return jsonify({'message': 'User not registered or confirmed for the associated event'}), 403

    # Verificar se o certificado já foi emitido
    existing_certificate = Certificate.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing_certificate:
        return jsonify({'message': 'Certificate already issued for this user and course', 'certificate': existing_certificate.to_dict()}), 409

    certificate_code = str(uuid.uuid4())
    
    # Gerar PDF do certificado
    pdf_path = generate_certificate_pdf(user.full_name, course.title, course.instructor, certificate_code, current_app.root_path)
    
    new_certificate = Certificate(user_id=user_id, course_id=course_id,
                                  certificate_code=certificate_code, certificate_pdf_path=pdf_path)
    db.session.add(new_certificate)
    db.session.commit()

    # Enviar e-mail com o certificado
    send_certificate_email(user.email, user.full_name, course.title, pdf_path)

    return jsonify({'message': 'Certificate issued and sent successfully', 'certificate': new_certificate.to_dict()}), 201

# Rota para listar certificados de um usuário logado
@course_certificate_bp.route('/my_certificates', methods=['GET'])
@login_required
def get_my_certificates():
    user_id = session.get('user_id')
    certificates = Certificate.query.filter_by(user_id=user_id).all()
    return jsonify([cert.to_dict() for cert in certificates]), 200

# Rota para baixar um certificado específico (requer login e que seja do usuário)
@course_certificate_bp.route('/certificates/<int:certificate_id>/download', methods=['GET'])
@login_required
def download_certificate(certificate_id):
    user_id = session.get('user_id')
    certificate = Certificate.query.filter_by(id=certificate_id, user_id=user_id).first()

    if not certificate:
        return jsonify({'message': 'Certificate not found or unauthorized'}), 404
    
    # Retornar o caminho para o frontend baixar (ou servir o arquivo diretamente)
    # Por simplicidade, retornamos o caminho. Em produção, você serviria o arquivo.
    return jsonify({'download_url': f'/static/certificates/{certificate.certificate_code}.pdf'}), 200


