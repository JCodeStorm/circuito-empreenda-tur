from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    company = db.Column(db.String(100), nullable=True)
    position = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'company': self.company,
            'position': self.position,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'is_active': self.is_active
        }

class EventRegistration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.String(50), nullable=False)  # gramado, camacari, etc.
    event_name = db.Column(db.String(200), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled
    special_requests = db.Column(db.Text, nullable=True)
    ticket_code = db.Column(db.String(255), unique=True, nullable=True)
    ticket_qr_path = db.Column(db.String(255), nullable=True) # Path to the generated QR code image

    user = db.relationship('User', backref=db.backref('registrations', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'event_id': self.event_id,
            'event_name': self.event_name,
            'registration_date': self.registration_date.isoformat() if self.registration_date else None,
            'status': self.status,
            'special_requests': self.special_requests
        }

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    event_id = db.Column(db.String(50), nullable=False)  # Removido foreign key
    duration_hours = db.Column(db.Integer, nullable=True)
    instructor = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'event_id': self.event_id,
            'duration_hours': self.duration_hours,
            'instructor': self.instructor,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    issue_date = db.Column(db.DateTime, default=datetime.utcnow)
    certificate_code = db.Column(db.String(255), unique=True, nullable=False)
    certificate_pdf_path = db.Column(db.String(255), nullable=True)

    user = db.relationship('User', backref=db.backref('certificates', lazy=True))
    course = db.relationship('Course', backref=db.backref('certificates', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'course_id': self.course_id,
            'issue_date': self.issue_date.isoformat() if self.issue_date else None,
            'certificate_code': self.certificate_code,
            'certificate_pdf_path': self.certificate_pdf_path
        }


