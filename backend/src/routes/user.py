from flask import Blueprint, jsonify, request, session
from models import User, EventRegistration, db
from utils import generate_qr_code, send_ticket_email
import uuid
import os
from functools import wraps

user_bp = Blueprint('user', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Login required'}), 401
        return f(*args, **kwargs)
    return decorated_function

# ===== AUTENTICAÇÃO =====
@user_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        
        # Validação básica
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Verificar se usuário já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Nome de usuário já existe'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já cadastrado'}), 400
        
        # Criar novo usuário
        user = User(
            username=data['username'],
            email=data['email'],
            full_name=data['full_name'],
            phone=data.get('phone'),
            company=data.get('company'),
            position=data.get('position')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Login automático após cadastro
        session['user_id'] = user.id
        session['username'] = user.username
        
        return jsonify({
            'message': 'Usuário cadastrado com sucesso',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        
        if not data.get('username') or not data.get('password'):
            return jsonify({'error': 'Username e password são obrigatórios'}), 400
        
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            session['username'] = user.username
            
            return jsonify({
                'message': 'Login realizado com sucesso',
                'user': user.to_dict()
            }), 200
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@user_bp.route('/me', methods=['GET'])
@login_required
def get_current_user():
    user = User.query.get(session['user_id'])
    return jsonify(user.to_dict())

# ===== INSCRIÇÕES EM EVENTOS =====
@user_bp.route('/events/register', methods=['POST'])
@login_required
def register_for_event():
    try:
        data = request.json
        user_id = session['user_id']
        
        if not data.get('event_id') or not data.get('event_name'):
            return jsonify({'error': 'event_id e event_name são obrigatórios'}), 400
        
        # Verificar se já está inscrito
        existing = EventRegistration.query.filter_by(
            user_id=user_id,
            event_id=data['event_id']
        ).first()
        
        if existing:
            return jsonify({'error': 'Você já está inscrito neste evento'}), 400
        
        # Criar inscrição
        registration = EventRegistration(
            user_id=user_id,
            event_id=data['event_id'],
            event_name=data['event_name'],
            special_requests=data.get('special_requests')
        )
        
        # Gerar ticket_code único
        ticket_code = str(uuid.uuid4())
        registration.ticket_code = ticket_code

        db.session.add(registration)
        db.session.commit()

        # Gerar QR Code
        qr_filename = f"ticket_{registration.id}.png"
        qr_code_path = generate_qr_code(ticket_code, qr_filename)
        registration.ticket_qr_path = qr_code_path
        db.session.commit()

        # Enviar e-mail de confirmação
        user = User.query.get(user_id)
        if user and send_ticket_email(user.email, user.full_name, data["event_name"], ticket_code, os.path.join(current_app.root_path, qr_code_path)):
            message = "Inscrição realizada com sucesso e e-mail de confirmação enviado."
        else:
            message = "Inscrição realizada com sucesso, mas houve um erro ao enviar o e-mail de confirmação."

        return jsonify({
            'message': message,
            'registration': registration.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/events/my-registrations', methods=['GET'])
@login_required
def get_my_registrations():
    user_id = session['user_id']
    registrations = EventRegistration.query.filter_by(user_id=user_id).all()
    return jsonify([reg.to_dict() for reg in registrations])

@user_bp.route('/events/registrations/<int:registration_id>', methods=['DELETE'])
@login_required
def cancel_registration(registration_id):
    user_id = session['user_id']
    registration = EventRegistration.query.filter_by(
        id=registration_id,
        user_id=user_id
    ).first()
    
    if not registration:
        return jsonify({'error': 'Inscrição não encontrada'}), 404
    
    registration.status = 'cancelled'
    db.session.commit()
    
    return jsonify({'message': 'Inscrição cancelada com sucesso'}), 200

# ===== GESTÃO DE USUÁRIOS (ADMIN) =====
@user_bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

@user_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@user_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    try:
        user = User.query.get(session['user_id'])
        data = request.json
        
        # Atualizar campos permitidos
        if 'full_name' in data:
            user.full_name = data['full_name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'company' in data:
            user.company = data['company']
        if 'position' in data:
            user.position = data['position']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ===== ESTATÍSTICAS =====
@user_bp.route('/stats', methods=['GET'])
def get_stats():
    total_users = User.query.count()
    total_registrations = EventRegistration.query.count()
    
    # Registrações por evento
    event_stats = db.session.query(
        EventRegistration.event_id,
        EventRegistration.event_name,
        db.func.count(EventRegistration.id).label('count')
    ).group_by(EventRegistration.event_id, EventRegistration.event_name).all()
    
    return jsonify({
        'total_users': total_users,
        'total_registrations': total_registrations,
        'events': [
            {
                'event_id': stat.event_id,
                'event_name': stat.event_name,
                'registrations': stat.count
            }
            for stat in event_stats
        ]
    })
