// ===== PÁGINA DE CONTATO =====

const API_BASE_URL = '/api';

// ===== FORMULÁRIO DE CONTATO =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Contador de caracteres
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 2000) {
                charCount.style.color = 'var(--error-color)';
                this.value = this.value.substring(0, 2000);
                charCount.textContent = '2000';
            } else if (currentLength > 1800) {
                charCount.style.color = 'var(--warning-color)';
            } else {
                charCount.style.color = 'var(--text-secondary)';
            }
        });
    }

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                if (value.length < 14) {
                    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
            
            this.value = value;
        });
    }

    // Submissão do formulário
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const contactData = Object.fromEntries(formData.entries());

        // Validações básicas
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            showContactMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!isValidEmail(contactData.email)) {
            showContactMessage('Por favor, insira um email válido.', 'error');
            return;
        }

        if (contactData.message.length > 2000) {
            showContactMessage('A mensagem deve ter no máximo 2000 caracteres.', 'error');
            return;
        }

        setContactLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(contactData)
            });

            const data = await response.json();

            if (response.ok) {
                showContactMessage(data.message, 'success');
                contactForm.reset();
                charCount.textContent = '0';
                
                // Scroll para a mensagem de sucesso
                setTimeout(() => {
                    document.getElementById('contactMessage').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            } else {
                showContactMessage(data.error || 'Erro ao enviar mensagem. Tente novamente.', 'error');
            }
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            showContactMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
        } finally {
            setContactLoading(false);
        }
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showContactMessage(message, type = 'error') {
    const messageElement = document.getElementById('contactMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide após 8 segundos para mensagens de sucesso
        if (type === 'success') {
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 8000);
        }
    }
}

function setContactLoading(isLoading) {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    if (isLoading) {
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
    } else {
        submitButton.disabled = false;
        btnText.style.display = 'inline-flex';
        btnLoading.style.display = 'none';
    }
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle do item atual
            if (isOpen) {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                icon.style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });
}

// ===== ANIMAÇÕES DE ENTRADA =====
function initContactAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos com classe 'reveal'
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function initRealTimeValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Remove erro quando o usuário começa a digitar
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.parentElement.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    let isValid = true;
    let errorMessage = '';

    // Remove erro anterior
    field.classList.remove('error');
    const existingError = field.parentElement.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Validações específicas
    switch (fieldName) {
        case 'name':
            if (!value) {
                isValid = false;
                errorMessage = 'Nome é obrigatório';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Nome deve ter pelo menos 2 caracteres';
            }
            break;
            
        case 'email':
            if (!value) {
                isValid = false;
                errorMessage = 'Email é obrigatório';
            } else if (!isValidEmail(value)) {
                isValid = false;
                errorMessage = 'Email inválido';
            }
            break;
            
        case 'subject':
            if (!value) {
                isValid = false;
                errorMessage = 'Selecione um assunto';
            }
            break;
            
        case 'message':
            if (!value) {
                isValid = false;
                errorMessage = 'Mensagem é obrigatória';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Mensagem deve ter pelo menos 10 caracteres';
            } else if (value.length > 2000) {
                isValid = false;
                errorMessage = 'Mensagem deve ter no máximo 2000 caracteres';
            }
            break;
    }

    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentElement.parentElement.appendChild(errorDiv);
    }

    return isValid;
}

// ===== EFEITOS VISUAIS =====
function initContactEffects() {
    // Efeito parallax no header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.page-header');
        
        if (header) {
            const speed = 0.5;
            header.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });

    // Efeito hover nos cards de informação
    const contactItems = document.querySelectorAll('.contact-info-item');
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = 'var(--shadow-medium)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--shadow-light)';
        });
    });
}

// ===== MAPA INTERATIVO =====
function initMap() {
    const mapButton = document.querySelector('.map-placeholder button');
    if (mapButton) {
        mapButton.addEventListener('click', function() {
            const address = 'Av. Paulista, 1000 - Bela Vista, São Paulo, SP';
            const encodedAddress = encodeURIComponent(address);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            window.open(googleMapsUrl, '_blank');
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página de contato
    if (document.querySelector('.contact-section')) {
        initContactForm();
        initRealTimeValidation();
        initContactAnimations();
        initContactEffects();
        initMap();
    }
    
    // FAQ pode estar em outras páginas também
    if (document.querySelector('.faq-section')) {
        initFAQ();
    }
});

// ===== FUNÇÕES GLOBAIS =====
window.contactUtils = {
    showContactMessage,
    setContactLoading,
    validateField,
    isValidEmail
};

