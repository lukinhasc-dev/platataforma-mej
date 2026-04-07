import { getAllMateriais, downloadMaterial } from "../api/material.index.js";
import { getAllLideres, loginLider } from "../api/lideres.index.js";

let slides = [];
let lideres = [];
let currentCategory = 'Todos';
let currentSearch = '';

const categories = [
    { name: 'Todos', icon: 'fa-border-all' },
    { name: 'Cultos', icon: 'fa-microphone' },
    { name: 'Estudos', icon: 'fa-book-open' },
    { name: 'Louvores', icon: 'fa-music' },
    { name: 'Outros', icon: 'fa-folder' },
];

async function loadMateriais() {
    try {
        const data = await getAllMateriais();
        slides = data;
        return data;
    } catch (error) {
        console.error("Erro ao carregar materiais:", error);
        return [];
    }
}

async function loadLideres() {
    try {
        const data = await getAllLideres();
        lideres = data;
        return data;
    } catch (error) {
        console.error("Erro ao carregar lideres:", error);
        return [];
    }
}




window.showToast = async function (message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-circle-exclamation';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => { setTimeout(() => toast.classList.add('show'), 10); });
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
};

async function init() {
    createParticles();
    slides = await loadMateriais();
    lideres = await loadLideres();
    setupScrollEffects();
    setupNavigation();
    setupMobileMenu();
    setupLoginModal();
    setupViewerModal();
    renderFilters();
    renderSlides();
    setupSearch();
}

//Função para criar particulas
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        let particle = document.createElement('div');
        particle.className = 'particle';
        let size = Math.random() * 6 + 2;
        let left = Math.random() * 100;
        let duration = Math.random() * 10 + 10;
        let delay = Math.random() * 10;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        container.appendChild(particle);
    }
}

//Função para configurar efeitos de scroll
function setupScrollEffects() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    window.revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => window.revealObserver.observe(el));
}

//Função para configurar navegação
async function setupNavigation() {
    const sections = document.querySelectorAll('section, main');
    const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 150)) { current = section.getAttribute('id'); }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) link.classList.add('active');
        });
    });
}

//Função para configurar o menu mobile
async function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMobileBtn = document.getElementById('closeMobileMenuBtn');
    const mobileLinks = document.querySelectorAll('.nav-mobile-link');

    if(!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });

    const closeMenu = () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    closeMobileBtn.addEventListener('click', closeMenu);
    mobileMenu.addEventListener('click', (e) => { 
        if (e.target === mobileMenu) closeMenu(); 
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

//Função para configurar modal de login
async function setupLoginModal() {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLoginBtn');
    const openBtnMobile = document.getElementById('mobileOpenLoginBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const loginForm = document.getElementById('loginForm');

    const openModal = () => { 
        modal.classList.remove('hidden'); 
        document.body.style.overflow = 'hidden';
        
        // Se o menu mobile estiver aberto, fecha ele
        const mobileMenu = document.getElementById('mobileMenu');
        if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    };

    if(openBtn) openBtn.addEventListener('click', openModal);
    if(openBtnMobile) openBtnMobile.addEventListener('click', openModal);
    
    closeBtn.addEventListener('click', () => { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; } });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = document.getElementById('email').value.trim();
        const passwordInput = document.getElementById('password').value.trim();

        if (!emailInput || !passwordInput) {
            showToast('Preencha o email e a senha.', 'error');
            return;
        }

        const btn = loginForm.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> A autenticar...';
        btn.disabled = true;

        try {
            // Deixa o backend comparar com bcrypt.compare (senha está hashada no banco)
            const resultado = await loginLider(emailInput, passwordInput);

            if (resultado.success) {
                showToast('Login efetuado com sucesso!', 'success');
                setTimeout(() => { window.location.href = '/front-end/admin.html'; }, 800);
            } else {
                showToast(resultado.message || 'Email ou senha incorretos.', 'error');
                btn.innerHTML = 'Entrar no Painel';
                btn.disabled = false;
            }
        } catch (error) {
            const msg = error?.response?.data?.message || 'Email ou senha incorretos.';
            showToast(msg, 'error');
            btn.innerHTML = 'Entrar no Painel';
            btn.disabled = false;
        }
    });
}

//Função para configurar modal de visualização
async function setupViewerModal() {
    const viewerModal = document.getElementById('viewerModal');
    const closeViewerBtn = document.getElementById('closeViewerBtn');
    const iframe = document.getElementById('fileIframe');
    const fallback = document.getElementById('viewerFallback');

    closeViewerBtn.addEventListener('click', closeViewer);
    viewerModal.addEventListener('click', (e) => { if (e.target === viewerModal) closeViewer(); });

    //Função para fechar modal de visualização
    function closeViewer() {
        viewerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        setTimeout(() => { iframe.src = ''; }, 300);
    }

    window.openViewer = async (id) => {
        const file = slides.find(s => s.id === id);
        if (!file) return;

        document.getElementById('viewerTitle').textContent = file.titulo_material;

        const fileUrl = file.link_material || file.url || '';
        const fileType = (file.tipo_material || file.type || '').toUpperCase();

        if (fileType === 'PDF') {
            iframe.classList.remove('hidden'); fallback.classList.add('hidden'); iframe.src = fileUrl;
        } else {
            iframe.classList.add('hidden'); fallback.classList.remove('hidden');
            document.getElementById('fallbackDownloadBtn').onclick = () => window.downloadMaterial(file.id, file.titulo_material);
        }




        viewerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
}

//Função para renderizar filtros
async function renderFilters() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = categories.map(cat => {
        const isActive = currentCategory === cat.name;
        return `
            <button onclick="window.setCategory('${cat.name}')" class="filter-btn ${isActive ? 'active' : ''}">
                <i class="fa-solid ${cat.icon}"></i> ${cat.name}
            </button>
        `;
    }).join('');
}

//Função para configurar busca
async function setupSearch() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => { currentSearch = e.target.value.toLowerCase(); renderSlides(); });
}

window.setCategory = (category) => { currentCategory = category; renderFilters(); renderSlides(); };
window.resetFilters = () => { currentCategory = 'Todos'; document.getElementById('searchInput').value = ''; currentSearch = ''; renderFilters(); renderSlides(); };

//Função para obter cor do arquivo
function getFileColorClass(type) {
    const t = (type || '').toUpperCase();
    if (t === 'PDF') return 'file-pdf';
    if (t === 'PPTX') return 'file-pptx';
    return 'file-default';
}

//Função para renderizar slides
async function renderSlides() {
    const grid = document.getElementById('slidesGrid');
    const status = document.getElementById('statusMessage');
    const empty = document.getElementById('emptyState');

    const filtered = slides.filter(slide => {
        const matchCat = currentCategory === 'Todos' || slide.categoria_material === currentCategory;
        const titulo = (slide.titulo_material || '').toLowerCase();
        const autor = (slide.autor_material || '').toLowerCase();
        const matchSearch = titulo.includes(currentSearch) || autor.includes(currentSearch);
        return matchCat && matchSearch;
    });

    status.innerHTML = `<i class="fa-solid fa-chart-simple text-gold"></i> A exibir ${filtered.length} resultados`;

    if (filtered.length === 0) {
        grid.innerHTML = ''; empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');

        grid.innerHTML = filtered.map((slide, index) => {
            const tipo = (slide.tipo_material || slide.type || 'Ficheiro').toUpperCase();
            const data = slide.created_at ? new Date(slide.created_at).toLocaleDateString('pt-PT') : '—';
            return `
            <div class="premium-card reveal" style="transition-delay: ${index * 60}ms">
                <div class="card-body">
                    <div class="card-header">
                        <div class="card-badges">
                            <span class="badge-category"><i class="fa-solid fa-folder"></i> ${slide.categoria_material || 'Geral'}</span>
                        </div>
                        <div class="card-meta">
                            <span class="file-type ${getFileColorClass(tipo)}">${tipo}</span>
                        </div>
                    </div>
                    <h3 class="card-title" title="${slide.titulo_material}">${slide.titulo_material}</h3>
                    <div class="card-author"><span class="author-icon"><i class="fa-solid fa-user"></i></span>${slide.autor_material || 'Desconhecido'}</div>
                    <hr class="card-divider">
                    <div class="card-footer">
                        <div class="card-date"><i class="fa-regular fa-calendar"></i> ${data}</div>
                        <div class="card-actions">
                            <button onclick="openViewer(${slide.id})" class="btn-action btn-view hover-lift" title="Visualizar"><i class="fa-regular fa-eye"></i></button>
                            <button onclick="window.downloadMaterial(${slide.id}, '${slide.titulo_material}')" class="btn-action btn-download btn-ripple hover-lift" title="Baixar"><i class="fa-solid fa-download"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `}).join('');

        document.querySelectorAll('#slidesGrid .reveal').forEach(el => {
            setTimeout(() => window.revealObserver.observe(el), 10);
        });
    }
}



// Tornar acessível globalmente
window.downloadMaterial = async (id, filename) => {
    try {
        window.showToast("Iniciando download...", "success");
        await downloadMaterial(id, filename);
    } catch (error) {
        console.error("Erro no download:", error);
        window.showToast("Erro ao baixar arquivo", "error");
    }
};

await init();