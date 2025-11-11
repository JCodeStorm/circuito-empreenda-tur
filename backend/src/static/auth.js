// ===== CONFIGURAÇÃO DA API =====
const API_BASE_URL = '/api';

// ===== UTILITÁRIOS =====
function showMessage(elementId, message, type = 'error') {
    const messageElement = document.getElementById(elementId);
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';
        
        // Auto-hide após 5 segundos
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.parentElement.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        button.className = 'fas fa-eye';
    }
}

function setLoading(formId, isLoading) {
    const form = document.getElementById(formId);
    const submitButton = form.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    if (isLoading) {
        submitButton.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
    } else {
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// ===== GERENCIAMENTO DE SESSÃO =====
function getCurrentUser() {
    return localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateAuthUI();
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
    updateAuthUI();
}

function updateAuthUI() {
    const user = getCurrentUser();
    const authButtons = document.querySelectorAll('.auth-buttons');
    
    authButtons.forEach(authButtonsContainer => {
        if (user) {
            authButtonsContainer.innerHTML = `
                <div class="user-menu">
                    <button class="user-menu-toggle">
                        <i class="fas fa-user"></i>
                        <span>${user.username}</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                    <div class="user-menu-dropdown">
                        <a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="perfil.html"><i class="fas fa-user-edit"></i> Meu Perfil</a>
                        <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Sair</a>
                    </div>
                </div>
            `;
        } else {
            authButtonsContainer.innerHTML = `
                <a href="login.html" class="btn btn-outline">Login</a>
                <a href="cadastro.html" class="btn btn-primary">Cadastre-se</a>
            `;
        }
    });
}

// ===== FUNÇÕES DE AUTENTICAÇÃO =====
async function login(username, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            return { success: true, user: data.user, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro no login:', error);
        return { success: false, message: 'Erro de conexão. Tente novamente.' };
    }
}

async function register(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (response.ok) {
            setCurrentUser(data.user);
            return { success: true, user: data.user, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        return { success: false, message: 'Erro de conexão. Tente novamente.' };
    }
}

async function logout() {
    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (error) {
        console.error('Erro no logout:', error);
    } finally {
        clearCurrentUser();
        window.location.href = 'index.html';
    }
}

async function registerForEvent(eventId, eventName, specialRequests = '') {
    try {
        const response = await fetch(`${API_BASE_URL}/events/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                event_id: eventId,
                event_name: eventName,
                special_requests: specialRequests
            })
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, registration: data.registration, message: data.message };
        } else {
            return { success: false, message: data.error };
        }
    } catch (error) {
        console.error('Erro na inscrição:', error);
        return { success: false, message: 'Erro de conexão. Tente novamente.' };
    }
}

// ===== MANIPULADORES DE FORMULÁRIOS =====
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showMessage('loginMessage', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setLoading('loginForm', true);

        const result = await login(username, password);

        setLoading('loginForm', false);

        if (result.success) {
            showMessage('loginMessage', result.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage('loginMessage', result.message);
        }
    });
}

function initRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(registerForm);
        const userData = Object.fromEntries(formData.entries());

        // Validações
        if (!userData.username || !userData.email || !userData.password || !userData.full_name) {
            showMessage('registerMessage', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (userData.password !== userData.confirm_password) {
            showMessage('registerMessage', 'As senhas não coincidem.');
            return;
        }

        if (userData.password.length < 6) {
            showMessage('registerMessage', 'A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (!document.getElementById('terms').checked) {
            showMessage('registerMessage', 'Você deve aceitar os Termos de Uso e Política de Privacidade.');
            return;
        }

        // Remove confirm_password antes de enviar
        delete userData.confirm_password;

        setLoading('registerForm', true);

        const result = await register(userData);

        setLoading('registerForm', false);

        if (result.success) {
            showMessage('registerMessage', result.message, 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showMessage('registerMessage', result.message);
        }
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar UI baseado no estado de autenticação
    updateAuthUI();
    
    // Inicializar formulários
    initLoginForm();
    initRegisterForm();
    
    // Verificar se o usuário está logado ao carregar páginas protegidas
    const protectedPages = ['dashboard.html', 'perfil.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !getCurrentUser()) {
        window.location.href = 'login.html';
    }
});

// ===== FUNÇÕES GLOBAIS PARA USO EM OUTRAS PÁGINAS =====
window.authUtils = {
    getCurrentUser,
    login,
    register,
    logout,
    registerForEvent,
    showMessage,
    setLoading
};

