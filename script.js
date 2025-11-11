// ===== INICIALIZAÇÃO ===== 
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initTimelineInteraction();
    initParallaxEffect();
});

// ===== MODO NOTURNO =====
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Verifica se há preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Aplica o tema inicial
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeIcon(themeIcon, true);
    }
    
    // Event listener para o botão de tema
    themeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        updateThemeIcon(themeIcon, isDarkMode);
        
        // Salva a preferência no localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Adiciona uma pequena animação ao botão
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    });
}

function updateThemeIcon(icon, isDarkMode) {
    if (isDarkMode) {
        icon.className = 'fas fa-moon';
    } else {
        icon.className = 'fas fa-sun';
    }
}

// ===== ANIMAÇÕES DE SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Para elementos com delay, adiciona classes específicas
                if (entry.target.classList.contains('delay-1')) {
                    setTimeout(() => {
                        entry.target.classList.add('show');
                    }, 200);
                } else if (entry.target.classList.contains('delay-2')) {
                    setTimeout(() => {
                        entry.target.classList.add('show');
                    }, 400);
                }
            }
        });
    }, observerOptions);
    
    // Observa todos os elementos com a classe 'reveal'
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(element => {
        observer.observe(element);
    });
    
    // Animação especial para contadores (se existirem)
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        observer.observe(stat);
        stat.addEventListener('show', () => {
            animateCounter(stat);
        });
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Mantém o formato original (com + se necessário)
        const originalText = element.textContent;
        const hasPlus = originalText.includes('+');
        element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
    }, 16);
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito de mudança do header no scroll
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adiciona/remove classe baseada na posição do scroll
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Esconde/mostra header baseado na direção do scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            
            // Previne scroll do body quando menu está aberto
            document.body.classList.toggle('menu-open');
        });
        
        // Fecha menu ao clicar em um link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// ===== INTERAÇÃO DA TIMELINE =====
function initTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            const eventId = this.getAttribute('data-event');
            if (eventId) {
                const targetElement = document.getElementById(eventId);
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Adiciona efeito visual temporário
                    targetElement.style.transform = 'scale(1.02)';
                    targetElement.style.boxShadow = '0 20px 40px rgba(42, 157, 143, 0.3)';
                    
                    setTimeout(() => {
                        targetElement.style.transform = '';
                        targetElement.style.boxShadow = '';
                    }, 1000);
                }
            }
        });
        
        // Efeito hover na timeline
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ===== EFEITO PARALLAX =====
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-background');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== LAZY LOADING DE IMAGENS =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== FORMULÁRIOS (PARA FUTURAS IMPLEMENTAÇÕES) =====
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui você pode adicionar lógica para envio de formulários
            const formData = new FormData(this);
            
            // Exemplo de feedback visual
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;
            
            // Simula envio (substitua por lógica real)
            setTimeout(() => {
                submitBtn.textContent = 'Enviado!';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        });
    });
}

// ===== UTILITÁRIOS =====
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// ===== PERFORMANCE =====
// Otimiza eventos de scroll e resize
const optimizedScrollHandler = debounce(function() {
    // Handlers de scroll otimizados podem ser adicionados aqui
}, 10);

const optimizedResizeHandler = debounce(function() {
    // Handlers de resize otimizados podem ser adicionados aqui
}, 250);

window.addEventListener('scroll', optimizedScrollHandler);
window.addEventListener('resize', optimizedResizeHandler);

// ===== ACESSIBILIDADE =====
function initAccessibility() {
    // Navegação por teclado
    document.addEventListener('keydown', function(e) {
        // ESC fecha menus
        if (e.key === 'Escape') {
            const activeMenu = document.querySelector('.nav.active');
            if (activeMenu) {
                activeMenu.classList.remove('active');
                document.querySelector('.mobile-menu-toggle').classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Foco visível para navegação por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ===== ANIMAÇÕES DE ENTRADA =====
function initEntranceAnimations() {
    // Adiciona delay progressivo para elementos em grid
    const gridItems = document.querySelectorAll('.events-grid .event-card, .highlights-grid .highlight-card');
    
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== INICIALIZAÇÃO COMPLETA =====
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initTimelineInteraction();
    initParallaxEffect();
    initLazyLoading();
    initForms();
    initAccessibility();
    initEntranceAnimations();
    
    // Adiciona classe para indicar que JS foi carregado
    document.body.classList.add('js-loaded');
});

// ===== LOADING STATE =====
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Remove qualquer loader se existir
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Erro JavaScript:', e.error);
    // Aqui você pode adicionar lógica para reportar erros
});

// ===== SERVICE WORKER (PARA PWA FUTURO) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('Falha ao registrar ServiceWorker:', error);
            });
    });
}



// ===== ANIMAÇÃO DOS CONTADORES (PÁGINA SOBRE) =====
function initCounters() {
    const counters = document.querySelectorAll('.number-value[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                animateCounter(counter, target);
                counter.parentElement.classList.add('counting');
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Formata o número baseado no valor
        let displayValue = Math.floor(current);
        
        // Adiciona formatação para números grandes
        if (target >= 1000) {
            displayValue = displayValue.toLocaleString('pt-BR');
        }
        
        // Adiciona o símbolo % se o target for 95 (satisfação)
        if (target === 95) {
            displayValue += '%';
        }
        
        element.textContent = displayValue;
    }, 16);
}

// ===== EFEITOS ESPECIAIS PARA EQUIPE =====
function initTeamEffects() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            // Adiciona efeito de destaque
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== EFEITOS PARA DEPOIMENTOS =====
function initTestimonialEffects() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    testimonials.forEach((testimonial, index) => {
        // Adiciona delay progressivo para animação
        testimonial.style.animationDelay = `${index * 0.2}s`;
        
        // Efeito hover especial
        testimonial.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) rotate(1deg)';
        });
        
        testimonial.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
}

// ===== EFEITOS PARA DIFERENCIAIS =====
function initDifferentialEffects() {
    const differentials = document.querySelectorAll('.differential-card');
    
    differentials.forEach((card, index) => {
        // Animação escalonada
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Efeito de pulso no ícone ao hover
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.differential-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.boxShadow = '0 10px 20px rgba(42, 157, 143, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.differential-icon');
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = 'none';
        });
    });
}

// ===== NAVEGAÇÃO SUAVE ENTRE SEÇÕES =====
function initSectionNavigation() {
    // Adiciona navegação suave para links internos da página sobre
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== EFEITO PARALLAX PARA SEÇÕES COM GRADIENTE =====
function initGradientParallax() {
    const gradientSections = document.querySelectorAll('.our-numbers, .our-commitment');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        gradientSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const speed = 0.5;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scrolled * speed);
                section.style.backgroundPosition = `center ${yPos}px`;
            }
        });
    });
}

// ===== LOADING PROGRESSIVO DE IMAGENS DA EQUIPE =====
function initProgressiveImageLoading() {
    const teamImages = document.querySelectorAll('.member-photo img, .testimonial-author img');
    
    teamImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '0';
            this.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                this.style.transition = 'all 0.5s ease';
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
}

// ===== ATUALIZAÇÃO DA INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidades existentes
    initThemeToggle();
    initScrollAnimations();
    initSmoothScrolling();
    initMobileMenu();
    initTimelineInteraction();
    initParallaxEffect();
    initLazyLoading();
    initForms();
    initAccessibility();
    initEntranceAnimations();
    
    // Novas funcionalidades para página Sobre
    initCounters();
    initTeamEffects();
    initTestimonialEffects();
    initDifferentialEffects();
    initSectionNavigation();
    initGradientParallax();
    initProgressiveImageLoading();
    
    // Adiciona classe para indicar que JS foi carregado
    document.body.classList.add('js-loaded');
});

// ===== EASTER EGG - EFEITO ESPECIAL NO LOGO =====
function initLogoEasterEgg() {
    const logo = document.querySelector('.logo');
    let clickCount = 0;
    
    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 5) {
                // Efeito especial após 5 cliques
                document.body.style.animation = 'rainbow 2s ease-in-out';
                
                setTimeout(() => {
                    document.body.style.animation = '';
                    clickCount = 0;
                }, 2000);
            }
        });
    }
}

// Adiciona o easter egg na inicialização
document.addEventListener('DOMContentLoaded', function() {
    initLogoEasterEgg();
});

// ===== ANIMAÇÃO RAINBOW PARA EASTER EGG =====
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

