// ===== GALERIA DE FOTOS =====

let currentImageSrc = '';
let currentImageTitle = '';

// ===== FILTROS DA GALERIA =====
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar itens
            galleryItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.6s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Reordenar grid após filtro
            setTimeout(() => {
                initMasonryLayout();
            }, 100);
        });
    });
}

// ===== LAYOUT MASONRY =====
function initMasonryLayout() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Simular layout masonry com CSS Grid
    const items = galleryGrid.querySelectorAll('.gallery-item[style*="block"], .gallery-item:not([style])');
    
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// ===== LIGHTBOX =====
function openLightbox(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    currentImageSrc = imageSrc;
    currentImageTitle = title;
    
    lightboxImage.src = imageSrc;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Adicionar listener para ESC
    document.addEventListener('keydown', handleLightboxKeydown);
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Remover listener
    document.removeEventListener('keydown', handleLightboxKeydown);
}

function handleLightboxKeydown(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
}

function downloadImage() {
    const link = document.createElement('a');
    link.href = currentImageSrc;
    link.download = `${currentImageTitle.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareImage() {
    if (navigator.share) {
        navigator.share({
            title: currentImageTitle,
            text: `Confira esta foto do ${currentImageTitle} - Circuito Empreenda Tur`,
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`Confira esta foto do ${currentImageTitle} - Circuito Empreenda Tur: ${window.location.href}`)}`;
        window.open(shareUrl, '_blank');
    }
}

// ===== CARREGAR MAIS FOTOS =====
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Simular carregamento de mais fotos
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        this.disabled = true;
        
        setTimeout(() => {
            // Adicionar mais itens fictícios
            addMoreGalleryItems();
            
            this.innerHTML = '<i class="fas fa-plus"></i> Carregar Mais Fotos';
            this.disabled = false;
        }, 2000);
    });
}

function addMoreGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const newItems = [
        {
            src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
            title: 'Workshop de Marketing Turístico',
            description: 'Capacitação em marketing digital para o turismo',
            date: 'Agosto 2024',
            category: 'palestras'
        },
        {
            src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
            title: 'Cerimônia de Premiação',
            description: 'Reconhecimento aos melhores profissionais',
            date: 'Julho 2024',
            category: 'eventos'
        },
        {
            src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=800',
            title: 'Jantar de Confraternização',
            description: 'Momento de descontração entre participantes',
            date: 'Junho 2024',
            category: 'networking'
        }
    ];
    
    newItems.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item reveal';
        galleryItem.setAttribute('data-category', item.category);
        galleryItem.style.display = 'none';
        
        galleryItem.innerHTML = `
            <div class="gallery-image">
                <img src="${item.src}" alt="${item.title}" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                        <span class="gallery-date">${item.date}</span>
                    </div>
                    <button class="gallery-zoom" onclick="openLightbox('${item.src}', '${item.title}')">
                        <i class="fas fa-search-plus"></i>
                    </button>
                </div>
            </div>
        `;
        
        galleryGrid.appendChild(galleryItem);
        
        // Animar entrada
        setTimeout(() => {
            galleryItem.style.display = 'block';
            galleryItem.style.animation = 'fadeInUp 0.6s ease forwards';
        }, 100);
    });
    
    // Atualizar contadores
    updateGalleryStats();
}

// ===== CONTADORES DA GALERIA =====
function updateGalleryStats() {
    const statsNumbers = document.querySelectorAll('.gallery-stats .stat-number');
    
    statsNumbers.forEach(stat => {
        const currentTarget = parseInt(stat.getAttribute('data-target'));
        const newTarget = currentTarget + Math.floor(Math.random() * 10) + 5;
        stat.setAttribute('data-target', newTarget);
        
        animateCounter(stat, newTarget);
    });
}

function animateCounter(element, target) {
    const duration = 1000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current);
    }, 16);
}

// ===== EFEITOS DE HOVER =====
function initGalleryHoverEffects() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const image = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        item.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.1)';
            overlay.style.opacity = '1';
        });
        
        item.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
            overlay.style.opacity = '0';
        });
    });
}

// ===== LAZY LOADING PARA GALERIA =====
function initGalleryLazyLoading() {
    const images = document.querySelectorAll('.gallery-item img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.src; // Força o carregamento
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== BUSCA NA GALERIA =====
function initGallerySearch() {
    // Adicionar campo de busca dinamicamente se não existir
    const filtersSection = document.querySelector('.gallery-filters .container');
    if (filtersSection && !document.querySelector('.gallery-search')) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'gallery-search';
        searchContainer.innerHTML = `
            <div class="search-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" id="gallerySearchInput" placeholder="Buscar fotos...">
                <button type="button" id="clearSearch" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        filtersSection.appendChild(searchContainer);
        
        // Adicionar funcionalidade de busca
        const searchInput = document.getElementById('gallerySearchInput');
        const clearButton = document.getElementById('clearSearch');
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const galleryItems = document.querySelectorAll('.gallery-item');
            
            if (searchTerm.length > 0) {
                clearButton.style.display = 'block';
            } else {
                clearButton.style.display = 'none';
            }
            
            galleryItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            
            // Mostrar todos os itens
            document.querySelectorAll('.gallery-item').forEach(item => {
                item.style.display = 'block';
            });
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se estamos na página da galeria
    if (document.querySelector('.gallery-section')) {
        initGalleryFilters();
        initMasonryLayout();
        initLoadMore();
        initGalleryHoverEffects();
        initGalleryLazyLoading();
        initGallerySearch();
        
        // Inicializar contadores quando visíveis
        const statsSection = document.querySelector('.gallery-stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const counters = entry.target.querySelectorAll('.stat-number');
                        counters.forEach(counter => {
                            const target = parseInt(counter.getAttribute('data-target'));
                            animateCounter(counter, target);
                        });
                        statsObserver.unobserve(entry.target);
                    }
                });
            });
            
            statsObserver.observe(statsSection);
        }
    }
    
    // Fechar lightbox ao clicar fora da imagem
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) {
                closeLightbox();
            }
        });
    }
});

// ===== FUNÇÕES GLOBAIS =====
window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;
window.downloadImage = downloadImage;
window.shareImage = shareImage;

