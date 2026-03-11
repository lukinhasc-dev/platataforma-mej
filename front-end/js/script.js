const mockSlides = [
    { id: 1, title: 'O Poder da Esperança', date: '08 Mar 2026', category: 'Sermão', author: 'Pr. Marcos Silva', size: '2.4 MB', type: 'PDF', icon: 'fa-book-open', isNew: true, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 2, title: 'Louvores - Domingo Manhã', date: '08 Mar 2026', category: 'Música', author: 'Min. Louvor', size: '5.1 MB', type: 'PPTX', icon: 'fa-music', isNew: true, url: '#' },
    { id: 3, title: 'Informativo Semanal', date: '08 Mar 2026', category: 'Avisos', author: 'Secretaria', size: '1.2 MB', type: 'PDF', icon: 'fa-bell', isNew: false, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 4, title: 'Estudo: O Livro de João', date: '04 Mar 2026', category: 'Estudo', author: 'Pra. Ana Costa', size: '3.8 MB', type: 'PPTX', icon: 'fa-pen-nib', isNew: false, url: '#' },
    { id: 5, title: 'Acampamento Jovem 2026', date: '01 Mar 2026', category: 'Eventos', author: 'Rede Jovem', size: '8.5 MB', type: 'PPTX', icon: 'fa-fire', isNew: false, url: '#' },
    { id: 6, title: 'Culto de Missões Globais', date: '28 Fev 2026', category: 'Sermão', author: 'Pr. Convidado', size: '4.1 MB', type: 'PPTX', icon: 'fa-earth-americas', isNew: false, url: '#' },
    { id: 7, title: 'Cifras Inéditas - Coral', date: '25 Fev 2026', category: 'Música', author: 'Maestro João', size: '1.5 MB', type: 'PDF', icon: 'fa-guitar', isNew: false, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 8, title: 'EBD: Heróis da Fé', date: '22 Fev 2026', category: 'Estudo', author: 'Dep. Infantil', size: '12 MB', type: 'PPTX', icon: 'fa-child-reaching', isNew: false, url: '#' }
];

const categories = [
    { name: 'Todos', icon: 'fa-layer-group' },
    { name: 'Sermão', icon: 'fa-book-open' },
    { name: 'Música', icon: 'fa-music' },
    { name: 'Estudo', icon: 'fa-pen-nib' },
    { name: 'Avisos', icon: 'fa-bell' },
    { name: 'Eventos', icon: 'fa-calendar-day' }
];

let currentCategory = 'Todos';
let currentSearch = '';

window.showToast = function (message, type = 'success') {
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

function init() {
    createParticles();
    setupScrollEffects();
    setupNavigation();
    setupLoginModal();
    setupViewerModal();
    renderFilters();
    renderSlides();
    setupSearch();
}

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

function setupNavigation() {
    const sections = document.querySelectorAll('section, main');
    const navLinks = document.querySelectorAll('.nav-link');

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

function setupLoginModal() {
    const modal = document.getElementById('loginModal');
    const openBtn = document.getElementById('openLoginBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const loginForm = document.getElementById('loginForm');

    openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; });
    closeBtn.addEventListener('click', () => { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; });
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; } });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = loginForm.querySelector('.btn-submit');
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> A autenticar...';
        btn.disabled = true;

        setTimeout(() => {
            showToast('Login efetuado com sucesso!', 'success');
            setTimeout(() => { window.location.href = '/front-end/admin.html'; }, 800);
        }, 1200);
    });
}

function setupViewerModal() {
    const viewerModal = document.getElementById('viewerModal');
    const closeViewerBtn = document.getElementById('closeViewerBtn');
    const iframe = document.getElementById('fileIframe');
    const fallback = document.getElementById('viewerFallback');

    closeViewerBtn.addEventListener('click', closeViewer);
    viewerModal.addEventListener('click', (e) => { if (e.target === viewerModal) closeViewer(); });

    function closeViewer() {
        viewerModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        setTimeout(() => { iframe.src = ''; }, 300);
    }

    window.openViewer = (id) => {
        const file = mockSlides.find(s => s.id === id);
        if (!file) return;

        document.getElementById('viewerTitle').textContent = file.title;
        if (file.type === 'PDF') {
            iframe.classList.remove('hidden'); fallback.classList.add('hidden'); iframe.src = file.url;
        } else {
            iframe.classList.add('hidden'); fallback.classList.remove('hidden');
            document.getElementById('fallbackDownloadBtn').onclick = () => window.open(file.url, '_blank');
        }

        viewerModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
}

function renderFilters() {
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

function setupSearch() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => { currentSearch = e.target.value.toLowerCase(); renderSlides(); });
}

window.setCategory = (category) => { currentCategory = category; renderFilters(); renderSlides(); };
window.resetFilters = () => { currentCategory = 'Todos'; document.getElementById('searchInput').value = ''; currentSearch = ''; renderFilters(); renderSlides(); };

function getFileColorClass(type) {
    if (type === 'PDF') return 'file-pdf';
    if (type === 'PPTX') return 'file-pptx';
    return 'file-default';
}

function renderSlides() {
    const grid = document.getElementById('slidesGrid');
    const status = document.getElementById('statusMessage');
    const empty = document.getElementById('emptyState');

    const filtered = mockSlides.filter(slide => {
        const matchCat = currentCategory === 'Todos' || slide.category === currentCategory;
        const matchSearch = slide.title.toLowerCase().includes(currentSearch) || slide.author.toLowerCase().includes(currentSearch);
        return matchCat && matchSearch;
    });

    status.innerHTML = `<i class="fa-solid fa-chart-simple text-gold"></i> A exibir ${filtered.length} resultados`;

    if (filtered.length === 0) {
        grid.innerHTML = ''; empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        grid.innerHTML = filtered.map((slide, index) => `
            <div class="premium-card reveal" style="transition-delay: ${index * 60}ms">
                <div class="card-body">
                    <div class="card-header">
                        <div class="card-badges">
                            <span class="badge-category"><i class="fa-solid ${slide.icon}"></i> ${slide.category}</span>
                            ${slide.isNew ? '<span class="badge-new">Novo</span>' : ''}
                        </div>
                        <div class="card-meta">
                            <span class="file-type ${getFileColorClass(slide.type)}">${slide.type}</span>
                            <span class="file-size">${slide.size}</span>
                        </div>
                    </div>
                    <h3 class="card-title" title="${slide.title}">${slide.title}</h3>
                    <div class="card-author"><span class="author-icon"><i class="fa-solid fa-user"></i></span>${slide.author}</div>
                    <hr class="card-divider">
                    <div class="card-footer">
                        <div class="card-date"><i class="fa-regular fa-calendar"></i> ${slide.date}</div>
                        <div class="card-actions">
                            <button onclick="openViewer(${slide.id})" class="btn-action btn-view hover-lift"><i class="fa-regular fa-eye"></i></button>
                            <a href="${slide.url}" target="_blank" class="btn-action btn-download btn-ripple hover-lift"><i class="fa-solid fa-download"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('#slidesGrid .reveal').forEach(el => {
            setTimeout(() => window.revealObserver.observe(el), 10);
        });
    }
}

init();