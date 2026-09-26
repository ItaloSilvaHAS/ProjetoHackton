// --- VERIFICAÇÃO DE SESSÃO AO CARREGAR ---
document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = localStorage.getItem("mural_usuario_ativo");
    const authModal = document.getElementById("auth-modal");

    if (!usuarioLogado) {
        authModal.style.display = "flex";
    } else {
        authModal.style.display = "none";
    }
});

// Alternar entre formulários de Login e Cadastro
function toggleAuthMode() {
    document.getElementById("login-form").classList.toggle("hidden");
    document.getElementById("register-form").classList.toggle("hidden");
}

// Processo de Cadastro
function handleRegister(event) {
    event.preventDefault();
    const nome = document.getElementById("reg-nome").value;
    const curso = document.getElementById("reg-curso").value;
    const email = document.getElementById("reg-email").value;
    const senha = document.getElementById("reg-senha").value;

    let usuarios = JSON.parse(localStorage.getItem("mural_usuarios") || "[]");
    
    if (usuarios.some(u => u.email === email)) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    usuarios.push({ nome, curso, email, senha });
    localStorage.setItem("mural_usuarios", JSON.stringify(usuarios));

    const usuarioAtivo = { nome, curso, email };
    localStorage.setItem("mural_usuario_ativo", JSON.stringify(usuarioAtivo));

    document.getElementById("auth-modal").style.display = "none";
    showToast("Bem-vindo!", "Cadastro realizado com sucesso.");
}

// Processo de Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;

    let usuarios = JSON.parse(localStorage.getItem("mural_usuarios") || "[]");
    
    // Cria um usuário padrão para facilitar testes se a lista estiver vazia
    if (usuarios.length === 0) {
        usuarios.push({ nome: "Rafael Costa", curso: "Redes", email: "teste@fatec.sp.gov.br", senha: "123" });
        localStorage.setItem("mural_usuarios", JSON.stringify(usuarios));
    }

    const user = usuarios.find(u => u.email === email && u.senha === senha);

    if (user) {
        const usuarioAtivo = { nome: user.nome, curso: user.curso, email: user.email };
        localStorage.setItem("mural_usuario_ativo", JSON.stringify(usuarioAtivo));
        document.getElementById("auth-modal").style.display = "none";
        showToast("Login bem-sucedido!", `Olá, ${user.nome}!`);
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

// Logout
function logout() {
    localStorage.removeItem("mural_usuario_ativo");
    location.reload();
}

// --- FUNÇÕES ORIGINAIS DO MURAL ---
function filterCards(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if(btn.dataset.target === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const cards = document.querySelectorAll('.mural-card');
    let visibleCount = 0;
    cards.forEach(card => {
        if (category === 'todos' || card.dataset.category === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const emptyState = document.getElementById('empty-state');
    if(visibleCount === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function upvote(btn) {
    const countSpan = btn.querySelector('.count');
    let count = parseInt(countSpan.innerText);
    
    if (btn.classList.contains('voted')) {
        countSpan.innerText = count - 1;
        btn.classList.remove('voted');
    } else {
        countSpan.innerText = count + 1;
        btn.classList.add('voted');
    }
    
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => { btn.style.transform = 'scale(1)'; }, 150);
}

const modalBackdrop = document.getElementById('modal-backdrop');
const modalContent = document.getElementById('modal-content');

function openModal() {
    modalBackdrop.classList.remove('hidden');
    setTimeout(() => {
        modalBackdrop.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    modalBackdrop.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        modalBackdrop.classList.add('hidden');
        document.getElementById('new-notice-form').reset();
    }, 300);
}

function submitForm(event) {
    event.preventDefault(); 
    closeModal();
    showToast('Aviso Publicado!', 'Seu recado foi fixado no mural com sucesso.');
    filterCards('todos');
}

function showToast(title, message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    toast.className = 'toast-item toast-enter';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="toast-content">
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('toast-enter');
        toast.classList.add('toast-active');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('toast-active');
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
