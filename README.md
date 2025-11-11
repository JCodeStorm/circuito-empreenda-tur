# Circuito Empreenda Tur - Site Completo

## 🌟 Sobre o Projeto

O **Circuito Empreenda Tur** é o maior evento itinerante de turismo do Brasil, conectando pessoas, destinos e oportunidades. Este site foi desenvolvido com design sofisticado e funcionalidades completas para oferecer a melhor experiência aos usuários.

## 🚀 Funcionalidades Implementadas

### 📱 Frontend Completo
- **Design Responsivo**: Compatível com desktop, tablet e mobile
- **Modo Noturno**: Alternância entre tema claro e escuro
- **Animações Suaves**: Efeitos de scroll e transições elegantes
- **Paleta de Cores**: Baseada na logo (azul-petróleo, rosa, amarelo, azul-escuro)

### 🏠 Páginas Principais

#### 1. **Página Inicial (index.html)**
- Banner principal com call-to-action
- Seção sobre o circuito
- Próximo evento em destaque
- Depoimentos de participantes
- Galeria de fotos
- Newsletter

#### 2. **Eventos e Cronograma (eventos.html)**
- Lista completa de eventos 2025-2026
- Cronograma interativo
- Detalhes de cada evento
- Formulário de inscrição
- Fotos dos destinos

#### 3. **Sobre Nós (sobre.html)**
- História da empresa (informações reais da FENAE Brasil)
- Missão, visão e valores
- Trajetória do Empreenda Tur (14 edições reais)
- Áreas de foco do turismo
- Contatos e endereços reais da FENAE Brasil

#### 4. **Galeria de Fotos (galeria.html)**
- Sistema de filtros por categoria
- Lightbox interativo
- Busca por texto
- Carregamento dinâmico
- Compartilhamento de imagens

#### 5. **Contato (contato.html)**
- Formulário funcional com validação
- Informações de contato
- FAQ interativo
- Mapa de localização
- Redes sociais

#### 6. **Blog de Turismo (blog.html)**
- Artigos sobre destinos e dicas
- Sistema de filtros e busca
- Newsletter integrada
- Página de artigo individual
- Sistema de comentários

#### 7. **Meus Certificados (meus_certificados.html)**
- Área para usuários logados visualizarem seus certificados
- Opção de baixar certificados em PDF
- Integração com o sistema de cursos do backend

### 🔐 Sistema de Autenticação
- **Cadastro de Usuários (cadastro.html)**
- **Login/Logout (login.html)**
- **Área do Usuário**
- **Gerenciamento de Inscrições**
- **Geração de Ingressos com QR Code**: Envio de confirmação por e-mail com QR Code único para cada inscrição.

### 🎓 Cursos e Certificados
- **Gerenciamento de Cursos**: Backend para criação e listagem de cursos.
- **Emissão de Certificados**: Geração de certificados em PDF para cursos concluídos.
- **Envio de Certificados por E-mail**: Certificados enviados automaticamente para o e-mail do usuário.

### ⚙️ Backend Flask
- **API RESTful** para todas as funcionalidades
- **Banco de dados SQLite** com modelos:
  - Usuários
  - Inscrições em eventos
  - Mensagens de contato
  - **Cursos**
  - **Certificados**
- **Validações e segurança**
- **Sistema de sessões**
- **Integração com Flask-Mail** para envio de e-mails (ingressos e certificados)
- **Geração de QR Codes** para ingressos
- **Geração de PDFs** para certificados

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos e responsivos
- **JavaScript** - Interatividade e funcionalidades
- **Font Awesome** - Ícones
- **Google Fonts** - Tipografia (Montserrat + Playfair Display)

### Backend
- **Python Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **Flask-CORS** - Suporte a CORS
- **Flask-Mail** - Envio de e-mails
- **qrcode[pil]** - Geração de QR Codes
- **Pillow (PIL)** - Manipulação de imagens para certificados
- **SQLite** - Banco de dados

## 📁 Estrutura do Projeto

```
circuito-empreenda-tur/
├── index.html              # Página inicial
├── eventos.html            # Eventos e cronograma
├── sobre.html              # Sobre nós
├── galeria.html            # Galeria de fotos
├── contato.html            # Contato
├── blog.html               # Blog principal
├── blog-article.html       # Artigo individual
├── login.html              # Login
├── cadastro.html           # Cadastro
├── meus_certificados.html  # Meus Certificados
├── style.css               # Estilos principais
├── script.js               # JavaScript principal
├── auth.js                 # Autenticação
├── contact.js              # Contato
├── gallery.js              # Galeria
├── blog.js                 # Blog
├── certificates.js         # Certificados
├── assets/                 # Imagens e recursos
│   ├── logo.png           # Logo da empresa
│   ├── destinos/          # Fotos dos destinos
│   └── galeria/           # Fotos de eventos
├── backend/               # Backend Flask
│   ├── src/
│   │   ├── main.py        # Aplicação principal
│   │   ├── models.py      # Modelos do banco (User, EventRegistration, Course, Certificate)
│   │   ├── routes/        # Rotas da API (user, contact, course_certificate)
│   │   ├── utils.py       # Utilitários (QR Code, e-mail, PDF de certificado)
│   │   └── static/        # Arquivos estáticos (QR Codes, PDFs de certificados)
│   ├── database/          # Pasta para o arquivo do banco de dados SQLite (app.db)
│   └── requirements.txt   # Dependências Python
└── README.md              # Este arquivo
```

## 🚀 Como Executar o Projeto (Com Backend)

Para ter todas as funcionalidades (cadastro, login, inscrições, certificados, contato, etc.) é **essencial** rodar o backend Flask.

### Pré-requisitos
- Python 3.8+ instalado
- `pip` (gerenciador de pacotes Python)

### Passos para Executar:

1.  **Navegue até a pasta do projeto:**
    ```bash
    cd circuito-empreenda-tur
    ```

2.  **Crie e ative um ambiente virtual (recomendado):**
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # No Linux/macOS
    # ou
    .\venv\Scripts\activate   # No Windows (PowerShell)
    # ou
    venv\Scripts\activate.bat # No Windows (CMD)
    ```

3.  **Instale as dependências do backend:**
    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **Configure as variáveis de ambiente para o envio de e-mails (Flask-Mail):**
    O backend utiliza o Flask-Mail para enviar e-mails de confirmação de ingresso e certificados. Você precisará configurar as credenciais do seu serviço de e-mail (ex: Gmail).
    
    Edite o arquivo `backend/src/main.py` e substitua os placeholders:
    ```python
    app.config["MAIL_USERNAME"] = "seu_email@gmail.com" # Substitua pelo seu email
    app.config["MAIL_PASSWORD"] = "sua_senha_de_aplicativo" # Substitua pela sua senha de aplicativo
    app.config["MAIL_DEFAULT_SENDER"] = "seu_email@gmail.com"
    ```
    **Importante**: Para Gmail, você precisará gerar uma "Senha de App" na sua conta Google.

5.  **Execute o servidor Flask:**
    ```bash
    python backend/src/main.py
    ```
    O servidor iniciará e criará o banco de dados `app.db` na pasta `backend/database/` se ele não existir.

6.  **Acesse o site no seu navegador:**
    [http://localhost:5000](http://localhost:5000)

### Sobre o Banco de Dados Local (SQLite)
- O projeto utiliza SQLite, que é um banco de dados baseado em arquivo. O arquivo do banco de dados é `app.db` e está localizado em `backend/database/`.
- **Não é necessário instalar um servidor de banco de dados separado.** O Flask e o SQLAlchemy gerenciam o arquivo automaticamente.
- **Para resetar o banco de dados:**
  1. Pare o servidor Flask (Ctrl+C no terminal).
  2. Apague o arquivo `backend/database/app.db`.
  3. Inicie o servidor novamente. Um novo banco de dados vazio será criado.

## 🌐 Funcionalidades Principais

