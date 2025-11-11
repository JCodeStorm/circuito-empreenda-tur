import qrcode
from PIL import Image, ImageDraw, ImageFont
import os
import uuid
from flask_mail import Mail, Message
from flask import current_app
from datetime import datetime
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor

mail = Mail()

def generate_certificate_pdf(user_name, course_title, instructor_name, certificate_code, root_path):
    certificates_dir = os.path.join(root_path, 'static', 'certificates')
    os.makedirs(certificates_dir, exist_ok=True)

    pdf_filename = f"certificate_{certificate_code}.pdf"
    pdf_path = os.path.join(certificates_dir, pdf_filename)

    # Criar PDF usando ReportLab
    c = canvas.Canvas(pdf_path, pagesize=landscape(A4))
    width, height = landscape(A4)
    
    # Cores baseadas na logo
    primary_color = HexColor('#2a9d8f')  # Azul-petróleo
    secondary_color = HexColor('#e76f51')  # Rosa
    accent_color = HexColor('#f4a261')  # Amarelo
    dark_color = HexColor('#264653')  # Azul-escuro
    
    # Fundo com gradiente (simulado com retângulos)
    c.setFillColor(HexColor('#f8f9fa'))
    c.rect(0, 0, width, height, fill=1)
    
    # Borda decorativa
    c.setStrokeColor(primary_color)
    c.setLineWidth(3)
    c.rect(30, 30, width-60, height-60, fill=0)
    
    # Título principal
    c.setFillColor(primary_color)
    c.setFont("Helvetica-Bold", 36)
    title_text = "CERTIFICADO DE CONCLUSÃO"
    title_width = c.stringWidth(title_text, "Helvetica-Bold", 36)
    c.drawString((width - title_width) / 2, height - 120, title_text)
    
    # Linha decorativa
    c.setStrokeColor(secondary_color)
    c.setLineWidth(2)
    c.line(width/2 - 150, height - 140, width/2 + 150, height - 140)
    
    # Texto principal
    c.setFillColor(dark_color)
    c.setFont("Helvetica", 18)
    text1 = "Certificamos que"
    text1_width = c.stringWidth(text1, "Helvetica", 18)
    c.drawString((width - text1_width) / 2, height - 200, text1)
    
    # Nome do usuário
    c.setFillColor(secondary_color)
    c.setFont("Helvetica-Bold", 28)
    name_width = c.stringWidth(user_name, "Helvetica-Bold", 28)
    c.drawString((width - name_width) / 2, height - 240, user_name)
    
    # Texto do curso
    c.setFillColor(dark_color)
    c.setFont("Helvetica", 18)
    text2 = "concluiu com sucesso o curso"
    text2_width = c.stringWidth(text2, "Helvetica", 18)
    c.drawString((width - text2_width) / 2, height - 280, text2)
    
    # Título do curso
    c.setFillColor(primary_color)
    c.setFont("Helvetica-Bold", 24)
    course_width = c.stringWidth(f'"{course_title}"', "Helvetica-Bold", 24)
    c.drawString((width - course_width) / 2, height - 320, f'"{course_title}"')
    
    # Instrutor
    c.setFillColor(dark_color)
    c.setFont("Helvetica", 16)
    instructor_text = f"Ministrado por {instructor_name}"
    instructor_width = c.stringWidth(instructor_text, "Helvetica", 16)
    c.drawString((width - instructor_width) / 2, height - 360, instructor_text)
    
    # Data
    c.setFont("Helvetica", 16)
    date_text = f"Em {datetime.now().strftime('%d de %B de %Y')}"
    date_width = c.stringWidth(date_text, "Helvetica", 16)
    c.drawString((width - date_width) / 2, height - 390, date_text)
    
    # Logo da FENAE Brasil (texto simulado)
    c.setFillColor(accent_color)
    c.setFont("Helvetica-Bold", 14)
    logo_text = "CIRCUITO EMPREENDA TUR"
    logo_width = c.stringWidth(logo_text, "Helvetica-Bold", 14)
    c.drawString((width - logo_width) / 2, height - 450, logo_text)
    
    c.setFillColor(dark_color)
    c.setFont("Helvetica", 12)
    org_text = "Uma iniciativa da FENAE Brasil"
    org_width = c.stringWidth(org_text, "Helvetica", 12)
    c.drawString((width - org_width) / 2, height - 470, org_text)
    
    # Código de verificação
    c.setFillColor(HexColor('#666666'))
    c.setFont("Helvetica", 10)
    code_text = f"Código de Verificação: {certificate_code}"
    code_width = c.stringWidth(code_text, "Helvetica", 10)
    c.drawString((width - code_width) / 2, 60, code_text)
    
    # Assinatura (linha)
    c.setStrokeColor(dark_color)
    c.setLineWidth(1)
    c.line(width/2 - 100, 120, width/2 + 100, 120)
    c.setFont("Helvetica", 10)
    signature_text = "Coordenação do Circuito Empreenda Tur"
    signature_width = c.stringWidth(signature_text, "Helvetica", 10)
    c.drawString((width - signature_width) / 2, 100, signature_text)
    
    c.save()
    return pdf_path

def generate_qr_code(data, filename, root_path):
    qr_codes_dir = os.path.join(root_path, 'static', 'qr_codes')
    os.makedirs(qr_codes_dir, exist_ok=True)
    
    qr_path = os.path.join(qr_codes_dir, filename)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(qr_path)
    return qr_path

def send_ticket_email(recipient_email, recipient_name, event_name, ticket_code, qr_code_path):
    try:
        msg = Message(
            subject=f"Confirmação de Inscrição - {event_name}",
            sender=current_app.config["MAIL_USERNAME"],
            recipients=[recipient_email]
        )
        
        msg.html = f'''
        <html>
        <head></head>
        <body>
            <p>Olá {recipient_name},</p>
            <p>Sua inscrição para o evento <strong>{event_name}</strong> foi confirmada com sucesso!</p>
            <p>Seu código de inscrição é: <strong>{ticket_code}</strong></p>
            <p>Por favor, apresente o QR Code abaixo na entrada do evento:</p>
            <img src="cid:qrcode_image" alt="QR Code do Ingresso">
            <p>Agradecemos sua participação no Circuito Empreenda Tur!</p>
            <p>Atenciosamente,</p>
            <p>Equipe Circuito Empreenda Tur</p>
        </body>
        </html>
        '''
        
        with current_app.open_resource(qr_code_path) as fp:
            msg.attach("qrcode.png", "image/png", fp.read(), 'inline', headers=[('Content-ID', '<qrcode_image>')])

        mail.send(msg)
        print(f"E-mail de ingresso enviado para {recipient_email}")
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail de ingresso para {recipient_email}: {e}")
        return False

def send_certificate_email(recipient_email, recipient_name, course_title, certificate_pdf_path):
    try:
        msg = Message(
            subject=f"Seu Certificado de Conclusão - {course_title}",
            sender=current_app.config["MAIL_USERNAME"],
            recipients=[recipient_email]
        )
        
        msg.html = f'''
        <html>
        <head></head>
        <body>
            <p>Olá {recipient_name},</p>
            <p>Parabéns! Você concluiu com sucesso o curso <strong>{course_title}</strong>.</p>
            <p>Seu certificado está anexado a este e-mail.</p>
            <p>Agradecemos sua participação e dedicação no Circuito Empreenda Tur!</p>
            <p>Atenciosamente,</p>
            <p>Equipe Circuito Empreenda Tur</p>
        </body>
        </html>
        '''
        
        with current_app.open_resource(certificate_pdf_path) as fp:
            msg.attach(f"certificado_{course_title.replace(' ', '_')}.pdf", "application/pdf", fp.read())

        mail.send(msg)
        print(f"E-mail de certificado enviado para {recipient_email}")
        return True
    except Exception as e:
        print(f"Erro ao enviar e-mail de certificado para {recipient_email}: {e}")
        return False


