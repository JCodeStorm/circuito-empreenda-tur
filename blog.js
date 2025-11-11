// ===== BLOG FUNCIONALIDADES =====

// ===== FILTROS E BUSCA =====
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    const searchInput = document.getElementById('blogSearchInput');
    const clearSearchBtn = document.getElementById('clearBlogSearch');
    const sortSelect = document.getElementById('sortSelect');

    // Filtros por categoria
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Atualizar botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filtrar cards
            filterBlogCards(category, searchInput ? searchInput.value : '');
        });
    });

    // Busca por texto
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            
            if (searchTerm.length > 0) {
                clearSearchBtn.style.display = 'block';
            } else {
                clearSearchBtn.style.display = 'none';
            }
            
            filterBlogCards(activeCategory, searchTerm);
        });
    }

    // Limpar busca
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-category');
            filterBlogCards(activeCategory, '');
        });
    }

    // Ordenação
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortBlogCards(this.value);
        });
    }
}

function filterBlogCards(category, searchTerm) {
    const blogCards = document.querySelectorAll('.blog-card');
    let visibleCount = 0;

    blogCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardDescription = card.querySelector('p').textContent.toLowerCase();
        
        const matchesCategory = category === 'all' || cardCategory === category;
        const matchesSearch = searchTerm === '' || 
                             cardTitle.includes(searchTerm) || 
                             cardDescription.includes(searchTerm);
        
        if (matchesCategory && matchesSearch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Mostrar mensagem se nenhum resultado
    updateNoResultsMessage(visibleCount);
}

function sortBlogCards(sortType) {
    const blogGrid = document.querySelector('.blog-grid');
    const blogCards = Array.from(document.querySelectorAll('.blog-card'));
    
    blogCards.sort((a, b) => {
        switch (sortType) {
            case 'recent':
                const dateA = new Date(a.querySelector('.blog-date').textContent);
                const dateB = new Date(b.querySelector('.blog-date').textContent);
                return dateB - dateA;
                
            case 'popular':
                const viewsA = parseInt(a.querySelector('.blog-stats span').textContent.replace('k', '000'));
                const viewsB = parseInt(b.querySelector('.blog-stats span').textContent.replace('k', '000'));
                return viewsB - viewsA;
                
            case 'alphabetical':
                const titleA = a.querySelector('h3').textContent;
                const titleB = b.querySelector('h3').textContent;
                return titleA.localeCompare(titleB);
                
            default:
                return 0;
        }
    });
    
    // Reordenar no DOM
    blogCards.forEach(card => {
        blogGrid.appendChild(card);
    });
}

function updateNoResultsMessage(visibleCount) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (visibleCount === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum artigo encontrado</h3>
                    <p>Tente ajustar os filtros ou termos de busca</p>
                </div>
            `;
            document.querySelector('.blog-grid').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

// ===== CARREGAR MAIS ARTIGOS =====
function initLoadMorePosts() {
    const loadMoreBtn = document.getElementById('loadMorePosts');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
        this.disabled = true;

        // Simular carregamento
        setTimeout(() => {
            addMoreBlogPosts();
            this.innerHTML = '<i class="fas fa-plus"></i> Carregar Mais Artigos';
            this.disabled = false;
        }, 2000);
    });
}

function addMoreBlogPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    const newPosts = [
        {
            category: 'dicas',
            image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
            title: 'Como Planejar uma Viagem Perfeita',
            description: 'Dicas essenciais para organizar sua próxima aventura sem estresse e dentro do orçamento.',
            date: '20 de Novembro, 2025',
            readTime: '6 min',
            views: '1.4k',
            likes: '67'
        },
        {
            category: 'cultura',
            image: 'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
            title: 'Festivais Folclóricos do Brasil',
            description: 'Conheça as tradições culturais mais autênticas do nosso país através de seus festivais.',
            date: '18 de Novembro, 2025',
            readTime: '8 min',
            views: '2.3k',
            likes: '145'
        },
        {
            category: 'aventura',
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
            title: 'Trilhas Imperdíveis no Brasil',
            description: 'Descubra as melhores trilhas para aventureiros de todos os níveis de experiência.',
            date: '15 de Novembro, 2025',
            readTime: '10 min',
            views: '3.1k',
            likes: '198'
        }
    ];

    newPosts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'blog-card reveal';
        article.setAttribute('data-category', post.category);
        article.style.display = 'none';

        article.innerHTML = `
            <div class="blog-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <div class="blog-category">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</div>
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">${post.date}</span>
                    <span class="blog-read-time">${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="blog-stats">
                    <span><i class="fas fa-eye"></i> ${post.views}</span>
                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                </div>
                <a href="blog-article.html?id=${post.title.toLowerCase().replace(/\s+/g, '-')}" class="blog-link">Ler mais</a>
            </div>
        `;

        blogGrid.appendChild(article);

        // Animar entrada
        setTimeout(() => {
            article.style.display = 'block';
            article.style.animation = 'fadeInUp 0.6s ease forwards';
        }, 100);
    });
}

// ===== NEWSLETTER =====
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    const sidebarNewsletter = document.querySelector('.sidebar-newsletter');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    if (sidebarNewsletter) {
        sidebarNewsletter.addEventListener('submit', handleNewsletterSubmit);
    }
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validar email
    if (!isValidEmail(email)) {
        showNewsletterMessage('Por favor, insira um email válido.', 'error');
        return;
    }

    // Simular envio
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscrevendo...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNewsletterMessage('Inscrição realizada com sucesso! Verifique seu email.', 'success');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showNewsletterMessage(message, type) {
    // Criar ou atualizar mensagem
    let messageEl = document.querySelector('.newsletter-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'newsletter-message';
        document.querySelector('.newsletter-form').appendChild(messageEl);
    }

    messageEl.textContent = message;
    messageEl.className = `newsletter-message ${type}`;
    messageEl.style.display = 'block';

    // Auto-hide após 5 segundos
    setTimeout(() => {
        messageEl.style.display = 'none';
    }, 5000);
}

// ===== ARTIGO INDIVIDUAL =====
function initArticlePage() {
    if (!document.querySelector('.article-content')) return;

    initArticleActions();
    initCommentForm();
    initTableOfContents();
    initReadingProgress();
}

function initArticleActions() {
    const likeBtn = document.querySelector('.like-btn');
    const shareBtn = document.querySelector('.share-btn');
    const bookmarkBtn = document.querySelector('.bookmark-btn');
    const shareOptions = document.querySelector('.share-options');

    if (likeBtn) {
        likeBtn.addEventListener('click', function() {
            const isLiked = this.getAttribute('data-liked') === 'true';
            const countSpan = this.querySelector('span');
            let count = parseInt(countSpan.textContent);

            if (isLiked) {
                this.setAttribute('data-liked', 'false');
                this.classList.remove('liked');
                countSpan.textContent = count - 1;
            } else {
                this.setAttribute('data-liked', 'true');
                this.classList.add('liked');
                countSpan.textContent = count + 1;
            }
        });
    }

    if (shareBtn && shareOptions) {
        shareBtn.addEventListener('click', function() {
            shareOptions.style.display = shareOptions.style.display === 'none' ? 'flex' : 'none';
        });

        // Fechar ao clicar fora
        document.addEventListener('click', function(e) {
            if (!shareBtn.contains(e.target) && !shareOptions.contains(e.target)) {
                shareOptions.style.display = 'none';
            }
        });
    }

    if (bookmarkBtn) {
        bookmarkBtn.addEventListener('click', function() {
            this.classList.toggle('bookmarked');
            const span = this.querySelector('span');
            span.textContent = this.classList.contains('bookmarked') ? 'Salvo' : 'Salvar';
        });
    }

    // Share options
    document.querySelectorAll('.share-option').forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.getAttribute('data-platform');
            const url = window.location.href;
            const title = document.querySelector('.article-title').textContent;
            
            shareToSocialMedia(platform, url, title);
        });
    });
}

function shareToSocialMedia(platform, url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

function initCommentForm() {
    const commentForm = document.getElementById('commentForm');
    if (!commentForm) return;

    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const textarea = this.querySelector('textarea');
        const comment = textarea.value.trim();
        
        if (comment.length < 10) {
            alert('O comentário deve ter pelo menos 10 caracteres.');
            return;
        }

        // Simular envio do comentário
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            addNewComment(comment);
            textarea.value = '';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

function addNewComment(commentText) {
    const commentsList = document.querySelector('.comments-list');
    const newComment = document.createElement('div');
    newComment.className = 'comment new-comment';
    
    newComment.innerHTML = `
        <div class="comment-avatar">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=60" alt="Você" loading="lazy">
        </div>
        <div class="comment-content">
            <div class="comment-header">
                <h5>Você</h5>
                <span class="comment-date">Agora</span>
            </div>
            <p>${commentText}</p>
            <div class="comment-actions">
                <button class="comment-action">
                    <i class="fas fa-thumbs-up"></i>
                    0
                </button>
                <button class="comment-action">
                    <i class="fas fa-reply"></i>
                    Responder
                </button>
            </div>
        </div>
    `;
    
    commentsList.insertBefore(newComment, commentsList.firstChild);
    
    // Animar entrada
    newComment.style.opacity = '0';
    newComment.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newComment.style.transition = 'all 0.5s ease';
        newComment.style.opacity = '1';
        newComment.style.transform = 'translateY(0)';
    }, 100);

    // Atualizar contador de comentários
    const commentCount = document.querySelector('.comments-section h3');
    const currentCount = parseInt(commentCount.textContent.match(/\d+/)[0]);
    commentCount.textContent = `Comentários (${currentCount + 1})`;
}

function initTableOfContents() {
    const tocList = document.querySelector('.toc-list');
    if (!tocList) return;

    const headings = document.querySelectorAll('.article-body h2, .article-body h3');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        // Smooth scroll para os links do TOC
        const tocLinks = tocList.querySelectorAll('a');
        tocLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
}

function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.appendChild(progressBar);

    const progressBarFill = progressBar.querySelector('.reading-progress-bar');
    const article = document.querySelector('.article-body');
    
    if (!article) return;

    window.addEventListener('scroll', function() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        const articleBottom = articleTop + articleHeight;
        const windowBottom = scrollTop + windowHeight;
        
        if (scrollTop >= articleTop && scrollTop <= articleBottom) {
            const progress = ((scrollTop - articleTop) / (articleHeight - windowHeight)) * 100;
            progressBarFill.style.width = Math.min(Math.max(progress, 0), 100) + '%';
            progressBar.style.opacity = '1';
        } else {
            progressBar.style.opacity = '0';
        }
    });
}

// ===== UTILITÁRIOS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== ANIMAÇÕES =====
function initBlogAnimations() {
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

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    initBlogFilters();
    initLoadMorePosts();
    initNewsletterForm();
    initArticlePage();
    initBlogAnimations();

    // Verificar parâmetros da URL para filtros
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const categoryBtn = document.querySelector(`[data-category="${category}"]`);
        if (categoryBtn) {
            categoryBtn.click();
        }
    }
});

// ===== ESTILOS DINÂMICOS =====
const blogStyles = `
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background-color: rgba(42, 157, 143, 0.2);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .reading-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .newsletter-message {
        margin-top: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        font-size: 0.9rem;
        display: none;
    }
    
    .newsletter-message.success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }
    
    .newsletter-message.error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
    
    .no-results-content {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .no-results-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
        opacity: 0.5;
    }
    
    .liked {
        color: var(--error-color) !important;
    }
    
    .bookmarked {
        color: var(--accent-color) !important;
    }
    
    .new-comment {
        border-left: 3px solid var(--primary-color);
        padding-left: 1rem;
    }
`;

// Adicionar estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = blogStyles;
document.head.appendChild(styleSheet);

