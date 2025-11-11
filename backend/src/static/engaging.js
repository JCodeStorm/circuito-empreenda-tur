// ===== ELEMENTOS CHAMATIVOS E INTERATIVOS =====

// ===== CONTADOR REGRESSIVO =====
function initCountdownTimer() {
    const countdownElements = document.querySelectorAll('.countdown-timer');
    
    countdownElements.forEach(element => {
        const targetDate = element.getAttribute('data-target-date');
        if (!targetDate) return;
        
        const target = new Date(targetDate).getTime();
        
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = target - now;
            
            if (distance < 0) {
                element.innerHTML = '<h4>Evento Iniciado!</h4>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const display = element.querySelector('.countdown-display');
            if (display) {
                display.innerHTML = `
                    <div class="countdown-item">
                        <span class="countdown-number">${days}</span>
                        <span class="countdown-label">Dias</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${hours}</span>
                        <span class="countdown-label">Horas</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${minutes}</span>
                        <span class="countdown-label">Min</span>
                    </div>
                    <div class="countdown-item">
                        <span class="countdown-number">${seconds}</span>
                        <span class="countdown-label">Seg</span>
                    </div>
                `;
            }
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// ===== NOTIFICAÇÕES FLUTUANTES =====
function showFloatingNotification(message, duration = 5000) {
    // Remover notificação existente
    const existing = document.querySelector('.floating-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'floating-notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Fechar ao clicar no X
    notification.querySelector('.close-btn').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após duração especificada
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

// ===== EFEITO DE DIGITAÇÃO =====
function initTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        element.textContent = '';
        element.style.display = 'inline-block';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };
        
        // Iniciar quando o elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// ===== BOTÃO SCROLL TO TOP =====
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Voltar ao topo');
    
    document.body.appendChild(scrollBtn);
    
    // Mostrar/ocultar baseado no scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll suave para o topo
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== BARRAS DE PROGRESSO ANIMADAS =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                const targetWidth = progressFill.getAttribute('data-width') || '75%';
                
                setTimeout(() => {
                    progressFill.style.width = targetWidth;
                }, 200);
                
                observer.unobserve(entry.target);
            }
        });
    });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// ===== PARTÍCULAS FLUTUANTES =====
function initFloatingParticles() {
    const containers = document.querySelectorAll('.floating-particles');
    
    containers.forEach(container => {
        const particleCount = parseInt(container.getAttribute('data-count')) || 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Posição inicial aleatória
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
            
            container.appendChild(particle);
        }
    });
}

// ===== EFEITOS DE HOVER MELHORADOS =====
function initEnhancedHovers() {
    const hoverElements = document.querySelectorAll('.enhanced-hover');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== INDICADORES DE POPULARIDADE =====
function updatePopularityIndicators() {
    const indicators = document.querySelectorAll('.popularity-indicator');
    
    indicators.forEach(indicator => {
        const baseViews = parseInt(indicator.getAttribute('data-base-views')) || 1000;
        const randomIncrement = Math.floor(Math.random() * 50) + 1;
        const newViews = baseViews + randomIncrement;
        
        const viewsSpan = indicator.querySelector('.views-count');
        if (viewsSpan) {
            viewsSpan.textContent = newViews;
        }
    });
}

// ===== SISTEMA DE BADGES DINÂMICOS =====
function addDynamicBadges() {
    // Adicionar badge "Novo" para eventos recentes
    const eventCards = document.querySelectorAll('.event-card');
    const now = new Date();
    
    eventCards.forEach(card => {
        const eventDate = card.getAttribute('data-event-date');
        if (eventDate) {
            const eventDateTime = new Date(eventDate);
            const daysDiff = (eventDateTime - now) / (1000 * 60 * 60 * 24);
            
            // Se o evento é em menos de 30 dias, adicionar badge de urgência
            if (daysDiff > 0 && daysDiff <= 30) {
                const badge = document.createElement('div');
                badge.className = 'limited-spots';
                badge.innerHTML = '<i class="fas fa-fire"></i> Vagas Limitadas';
                card.style.position = 'relative';
                card.appendChild(badge);
            }
        }
    });
    
    // Adicionar badge "Popular" para artigos do blog
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach((card, index) => {
        if (index < 3) { // Primeiros 3 artigos são "populares"
            const badge = document.createElement('div');
            badge.className = 'popularity-indicator';
            badge.innerHTML = '<i class="fas fa-star"></i> Popular';
            card.style.position = 'relative';
            card.appendChild(badge);
        }
    });
}

// ===== MICRO-INTERAÇÕES =====
function initMicroInteractions() {
    // Efeito de clique em botões
    const buttons = document.querySelectorAll('.btn, .cta-primary');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== NOTIFICAÇÕES CONTEXTUAIS =====
function initContextualNotifications() {
    // Notificação quando usuário fica muito tempo na página
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 1000;
        
        // Após 30 segundos, mostrar notificação de engajamento
        if (timeOnPage === 30000) {
            showFloatingNotification('🎯 Gostando do que vê? Inscreva-se em nossos eventos!', 8000);
        }
        
        // Após 60 segundos, mostrar notificação de newsletter
        if (timeOnPage === 60000) {
            showFloatingNotification('📧 Não perca nenhuma novidade! Assine nossa newsletter.', 8000);
        }
        
        // Parar após 2 minutos
        if (timeOnPage >= 120000) {
            clearInterval(timeInterval);
        }
    }, 1000);
    
    // Notificação quando usuário tenta sair da página
    window.addEventListener('beforeunload', (e) => {
        if (timeOnPage > 10000) { // Só se ficou mais de 10 segundos
            e.preventDefault();
            e.returnValue = 'Tem certeza que deseja sair? Você pode estar perdendo oportunidades incríveis!';
        }
    });
}

// ===== ANIMAÇÕES DE ENTRADA =====
function initEntranceAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animation = entry.target.getAttribute('data-animate');
                entry.target.style.animation = `${animation} 0.8s ease forwards`;
                observer.unobserve(entry.target);
            }
        });
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ===== ESTILOS DINÂMICOS =====
const engagingStyles = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn, .cta-primary {
        position: relative;
        overflow: hidden;
    }
`;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar estilos dinâmicos
    const styleSheet = document.createElement('style');
    styleSheet.textContent = engagingStyles;
    document.head.appendChild(styleSheet);
    
    // Inicializar todas as funcionalidades
    initCountdownTimer();
    initTypingEffect();
    initScrollToTop();
    initProgressBars();
    initFloatingParticles();
    initEnhancedHovers();
    initMicroInteractions();
    initEntranceAnimations();
    
    // Inicializar após um pequeno delay para garantir que o DOM esteja pronto
    setTimeout(() => {
        addDynamicBadges();
        updatePopularityIndicators();
        initContextualNotifications();
    }, 1000);
    
    // Atualizar indicadores de popularidade periodicamente
    setInterval(updatePopularityIndicators, 30000); // A cada 30 segundos
    
    // Mostrar notificação de boas-vindas
    setTimeout(() => {
        showFloatingNotification('🎉 Bem-vindo ao Circuito Empreenda Tur! Explore nossos eventos incríveis.', 6000);
    }, 2000);
});

// ===== FUNÇÕES UTILITÁRIAS PÚBLICAS =====
window.EngagingElements = {
    showNotification: showFloatingNotification,
    updatePopularity: updatePopularityIndicators,
    addBadge: (element, type, text) => {
        const badge = document.createElement('div');
        badge.className = `${type}-badge`;
        badge.textContent = text;
        element.style.position = 'relative';
        element.appendChild(badge);
    }
};

