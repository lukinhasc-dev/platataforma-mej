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

let adminSlides = [
    { id: 1, title: 'O Poder da Esperança', category: 'Sermão', author: 'Pr. Marcos Silva', date: '08 Mar 2026' },
    { id: 2, title: 'Louvores - Domingo Manhã', category: 'Música', author: 'Min. Louvor', date: '08 Mar 2026' },
    { id: 3, title: 'Informativo Semanal', category: 'Avisos', author: 'Secretaria', date: '08 Mar 2026' },
    { id: 4, title: 'Estudo: O Livro de João', category: 'Estudo', author: 'Pra. Ana Costa', date: '04 Mar 2026' },
    { id: 5, title: 'Acampamento Jovem 2026', category: 'Eventos', author: 'Rede Jovem', date: '01 Mar 2026' }
];

let adminLeaders = [
    { id: 1, name: 'Marcos Silva', role: 'Pastor(a)', email: 'marcos@igrejaviva.com' },
    { id: 2, name: 'Ana Costa', role: 'Pastor(a)', email: 'ana@igrejaviva.com' },
    { id: 3, name: 'João Pedro', role: 'Líder de Louvor', email: 'louvor@igrejaviva.com' },
    { id: 4, name: 'Sara Mendes', role: 'Secretaria', email: 'secretaria@igrejaviva.com' }
];

function initAdmin() {
    setupMobileSidebar();
    setupModals();
    setupAcervoSearchAndFilter();

    document.getElementById('totalFilesCount').innerText = adminSlides.length;
    document.getElementById('totalLeadersCount').innerText = adminLeaders.length;

    renderDashboardTable();
    renderAcervoTable(adminSlides);
    renderLiderancaTable();
}

window.switchView = function (viewId, element) {
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    element.classList.add('active');

    document.querySelectorAll('.admin-view').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('active', 'fade-in-up');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    targetView.classList.remove('hidden');

    requestAnimationFrame(() => {
        targetView.classList.add('active', 'fade-in-up');
    });

    if (window.innerWidth <= 1024) {
        document.getElementById('adminSidebar').classList.remove('open');
        document.getElementById('sidebarOverlay').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

function renderDashboardTable() {
    const tbody = document.getElementById('dashboardTableBody');
    tbody.innerHTML = adminSlides.slice(0, 3).map((slide, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.1}s; opacity: 0;">
            <td class="font-bold text-dark">${slide.title}</td>
            <td><span class="badge-category text-xs"><i class="fa-solid fa-tag mr-1"></i> ${slide.category}</span></td>
            <td class="text-gray-500">${slide.date}</td>
        </tr>
    `).join('');
}

function renderAcervoTable(dataToRender) {
    const tbody = document.getElementById('acervoTableBody');
    if (dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 py-4 fade-in">Nenhum ficheiro encontrado.</td></tr>`;
        return;
    }
    tbody.innerHTML = dataToRender.map((slide, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
            <td class="font-bold text-dark">${slide.title}</td>
            <td><span class="badge-category text-xs"><i class="fa-solid fa-tag mr-1"></i> ${slide.category}</span></td>
            <td class="text-gray-500 hidden-mobile">${slide.author}</td>
            <td class="text-gray-500 hidden-mobile">${slide.date}</td>
            <td>
                <div class="flex gap-2">
                    <button class="action-btn text-blue-500 hover:bg-blue-50 hover-lift" onclick="showToast('Ação de edição em breve!', 'success')"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn text-red-500 hover:bg-red-50 hover-lift" onclick="deleteFile(${slide.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderLiderancaTable() {
    const tbody = document.getElementById('liderancaTableBody');
    tbody.innerHTML = adminLeaders.map((leader, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
            <td class="font-bold text-dark flex align-center gap-2">
                <div class="author-icon"><i class="fa-solid fa-user"></i></div>
                ${leader.name}
            </td>
            <td><span class="text-sm font-medium text-gray-700">${leader.role}</span></td>
            <td class="text-gray-500 hidden-mobile">${leader.email}</td>
            <td>
                <button class="action-btn text-red-500 hover:bg-red-50 hover-lift" onclick="deleteLeader(${leader.id})" title="Revogar Acesso"><i class="fa-solid fa-user-xmark"></i></button>
            </td>
        </tr>
    `).join('');
}

window.deleteFile = function (id) {
    if (confirm('Tem a certeza que deseja apagar este ficheiro?')) {
        adminSlides = adminSlides.filter(s => s.id !== id);
        renderAcervoTable(adminSlides);
        renderDashboardTable();
        document.getElementById('totalFilesCount').innerText = adminSlides.length;
        showToast('Ficheiro apagado.', 'error');
    }
};

window.deleteLeader = function (id) {
    if (confirm('Tem a certeza que deseja revogar o acesso a este líder?')) {
        adminLeaders = adminLeaders.filter(l => l.id !== id);
        renderLiderancaTable();
        document.getElementById('totalLeadersCount').innerText = adminLeaders.length;
        showToast('Acesso revogado.', 'error');
    }
};

function setupAcervoSearchAndFilter() {
    const searchInput = document.getElementById('adminSearchInput');
    const categorySelect = document.getElementById('adminCategoryFilter');

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const filtered = adminSlides.filter(slide => {
            const matchSearch = slide.title.toLowerCase().includes(searchTerm) || slide.author.toLowerCase().includes(searchTerm);
            const matchCat = category === 'Todos' || slide.category === category;
            return matchSearch && matchCat;
        });
        renderAcervoTable(filtered);
    }
    searchInput.addEventListener('input', filterData);
    categorySelect.addEventListener('change', filterData);
}

function setupMobileSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const closeBtn = document.getElementById('closeAdminMenuBtn');
    const closeSidebar = () => {
        document.getElementById('adminSidebar').classList.remove('open');
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
}

function setupModals() {
    const uploadForm = document.getElementById('uploadForm');
    const submitUploadBtn = document.getElementById('submitUploadBtn');

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = submitUploadBtn.innerHTML;
        submitUploadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> A guardar...';
        submitUploadBtn.disabled = true;

        setTimeout(() => {
            const title = document.getElementById('fileTitle').value;
            const category = document.getElementById('fileCategory').value;
            const author = document.getElementById('fileAuthor').value;

            adminSlides.unshift({ id: Date.now(), title: title, category: category, author: author, date: 'Hoje' });
            renderAcervoTable(adminSlides); renderDashboardTable();
            document.getElementById('totalFilesCount').innerText = adminSlides.length;

            showToast(`Ficheiro "${title}" adicionado!`, 'success');
            document.getElementById('uploadModal').classList.add('hidden');
            uploadForm.reset(); submitUploadBtn.innerHTML = originalText; submitUploadBtn.disabled = false;
        }, 1200);
    });

    const addLeaderForm = document.getElementById('addLeaderForm');
    const submitLeaderBtn = document.getElementById('submitLeaderBtn');

    addLeaderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const originalText = submitLeaderBtn.innerHTML;
        submitLeaderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> A criar acesso...';
        submitLeaderBtn.disabled = true;

        setTimeout(() => {
            const name = document.getElementById('leaderName').value;
            const role = document.getElementById('leaderRole').value;
            const email = document.getElementById('leaderEmail').value;

            adminLeaders.unshift({ id: Date.now(), name: name, role: role, email: email });
            renderLiderancaTable(); document.getElementById('totalLeadersCount').innerText = adminLeaders.length;

            showToast(`Acesso criado para ${name}!`, 'success');
            document.getElementById('addLeaderModal').classList.add('hidden');
            addLeaderForm.reset(); submitLeaderBtn.innerHTML = originalText; submitLeaderBtn.disabled = false;
        }, 1200);
    });
}

initAdmin();