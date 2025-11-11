from flask import Blueprint, jsonify, request
from models import db
from datetime import datetime
import re

contact_bp = Blueprint('contact', __name__)

# Modelo para mensagens de contato
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='new')  # new, read, replied
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'company': self.company,
            'subject': self.subject,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'status': self.status
        }

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@contact_bp.route('/contact', methods=['POST'])
def send_contact_message():
    try:
        data = request.json
        
        # Validação básica
        required_fields = ['name', 'email', 'subject', 'message']
        for field in required_fields:
            if not data.get(field) or not data.get(field).strip():
                return jsonify({'error': f'Campo {field} é obrigatório'}), 400
        
        # Validar email
        if not validate_email(data['email']):
            return jsonify({'error': 'Email inválido'}), 400
        
        # Validar tamanho dos campos
        if len(data['name']) > 100:
            return jsonify({'error': 'Nome muito longo (máximo 100 caracteres)'}), 400
        
        if len(data['subject']) > 200:
            return jsonify({'error': 'Assunto muito longo (máximo 200 caracteres)'}), 400
        
        if len(data['message']) > 2000:
            return jsonify({'error': 'Mensagem muito longa (máximo 2000 caracteres)'}), 400
        
        # Criar mensagem de contato
        contact_message = ContactMessage(
            name=data['name'].strip(),
            email=data['email'].strip().lower(),
            phone=data.get('phone', '').strip() if data.get('phone') else None,
            company=data.get('company', '').strip() if data.get('company') else None,
            subject=data['subject'].strip(),
            message=data['message'].strip()
        )
        
        db.session.add(contact_message)
        db.session.commit()
        
        # Aqui você poderia adicionar envio de email
        # send_notification_email(contact_message)
        
        return jsonify({
            'message': 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
            'contact_id': contact_message.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Erro interno do servidor. Tente novamente.'}), 500

@contact_bp.route('/contact/messages', methods=['GET'])
def get_contact_messages():
    """Rota para administradores visualizarem mensagens"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', None)
        
        query = ContactMessage.query
        
        if status:
            query = query.filter_by(status=status)
        
        messages = query.order_by(ContactMessage.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'messages': [msg.to_dict() for msg in messages.items],
            'total': messages.total,
            'pages': messages.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/contact/messages/<int:message_id>', methods=['GET'])
def get_contact_message(message_id):
    """Obter mensagem específica"""
    try:
        message = ContactMessage.query.get_or_404(message_id)
        
        # Marcar como lida
        if message.status == 'new':
            message.status = 'read'
            db.session.commit()
        
        return jsonify(message.to_dict())
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/contact/messages/<int:message_id>/status', methods=['PUT'])
def update_message_status(message_id):
    """Atualizar status da mensagem"""
    try:
        message = ContactMessage.query.get_or_404(message_id)
        data = request.json
        
        if 'status' in data and data['status'] in ['new', 'read', 'replied']:
            message.status = data['status']
            db.session.commit()
            
            return jsonify({
                'message': 'Status atualizado com sucesso',
                'contact': message.to_dict()
            })
        else:
            return jsonify({'error': 'Status inválido'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@contact_bp.route('/contact/stats', methods=['GET'])
def get_contact_stats():
    """Estatísticas de contato"""
    try:
        total_messages = ContactMessage.query.count()
        new_messages = ContactMessage.query.filter_by(status='new').count()
        read_messages = ContactMessage.query.filter_by(status='read').count()
        replied_messages = ContactMessage.query.filter_by(status='replied').count()
        
        # Mensagens por mês (últimos 6 meses)
        from sqlalchemy import func, extract
        monthly_stats = db.session.query(
            extract('month', ContactMessage.created_at).label('month'),
            extract('year', ContactMessage.created_at).label('year'),
            func.count(ContactMessage.id).label('count')
        ).group_by(
            extract('year', ContactMessage.created_at),
            extract('month', ContactMessage.created_at)
        ).order_by(
            extract('year', ContactMessage.created_at).desc(),
            extract('month', ContactMessage.created_at).desc()
        ).limit(6).all()
        
        return jsonify({
            'total_messages': total_messages,
            'new_messages': new_messages,
            'read_messages': read_messages,
            'replied_messages': replied_messages,
            'monthly_stats': [
                {
                    'month': int(stat.month),
                    'year': int(stat.year),
                    'count': stat.count
                }
                for stat in monthly_stats
            ]
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

