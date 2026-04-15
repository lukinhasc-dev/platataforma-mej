import { getAllLideres, createLider, deleteLider, updateLider } from "../api/lideres.index.js"
import { getAllMateriais, createMaterial, deleteMaterial, updateMaterial, downloadMaterial } from "../api/material.index.js"

// Variáveis de estado global (no escopo do módulo)
let adminSlides = [];
let adminLeaders = [];
let totalDownloads = 0;

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

async function refreshMateriais() {
    try {
        adminSlides = await getAllMateriais();
        renderAcervoTable(adminSlides);
        renderDashboardTable();
        const totalFilesEl = document.getElementById('totalFilesCount');
        if (totalFilesEl) totalFilesEl.innerText = adminSlides.length;
    } catch (error) {
        console.error("Erro ao atualizar materiais:", error);
    }
}

async function refreshLideres() {
    try {
        adminLeaders = await getAllLideres();
        renderLiderancaTable();
        const totalLeadersEl = document.getElementById('totalLeadersCount');
        if (totalLeadersEl) totalLeadersEl.innerText = adminLeaders.length;
    } catch (error) {
        console.error("Erro ao atualizar líderes:", error);
    }
}

async function initAdmin() {
    // Guard de autenticação — redireciona se não tiver token
    if (!localStorage.getItem('mej_token')) {
        window.location.href = '/front-end/index.html';
        return;
    }

    setupMobileSidebar();
    setupModals();
    setupAcervoSearchAndFilter();

    try {
        adminLeaders = await getAllLideres();
        adminSlides = await getAllMateriais();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        window.showToast("Erro ao carregar dados do servidor", "error");
    }

    document.getElementById('totalFilesCount').innerText = adminSlides.length;
    document.getElementById('totalLeadersCount').innerText = adminLeaders.length;

    const totalDownloads = adminSlides.reduce((acc, slide) => acc + (slide.downloads_mes || 0), 0);
    document.getElementById('totalDownloadsCount').innerText = totalDownloads;

    renderDashboardTable();
    renderAcervoTable(adminSlides);
    renderLiderancaTable();
    await refreshLideres();
    await refreshMateriais();
}

window.initAdmin = initAdmin;

// Função para trocar de view
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

// Função para renderizar a tabela do dashboard
async function renderDashboardTable() {
    const tbody = document.getElementById('dashboardTableBody');
    const recentSlides = adminSlides.slice(0, 3);
    tbody.innerHTML = recentSlides.map((material, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.1}s; opacity: 0;">
            <td class="font-bold text-dark">${material.titulo_material}</td>
            <td><span class="badge-category text-xs"><i class="fa-solid fa-tag mr-1"></i> ${material.categoria_material}</span></td>
            <td class="text-gray-500">${new Date(material.created_at).toLocaleDateString('pt-BR')}</td>
        </tr>
    `).join('');
}

// Função para renderizar a tabela do acervo
async function renderAcervoTable(dataToRender) {
    const tbody = document.getElementById('acervoTableBody');
    if (!dataToRender || dataToRender.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500 py-4 fade-in">Nenhum arquivo encontrado.</td></tr>`;
        return;
    }
    tbody.innerHTML = dataToRender.map((material, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
            <td class="font-bold text-dark">${material.titulo_material}</td>
            <td><span class="badge-category text-xs"><i class="fa-solid fa-tag mr-1"></i> ${material.categoria_material}</span></td>
            <td class="text-gray-500 hidden-mobile">${material.autor_material}</td>
            <td class="text-gray-500 hidden-mobile">${new Date(material.created_at).toLocaleDateString('pt-BR')}</td>
            <td class="text-center"><span class="font-bold text-orange-500">${material.downloads_mes || 0}</span></td>
            <td>
                <div class="flex gap-2">
                    <button class="action-btn text-green-500 hover:bg-green-50 hover-lift" onclick="downloadMaterial(${material.id}, '${material.titulo_material}')" title="Baixar"><i class="fa-solid fa-download"></i></button>
                    <button class="action-btn text-blue-500 hover:bg-blue-50 hover-lift" onclick="editFile(${material.id})" title="Editar"><i class="fa-solid fa-edit"></i></button>
                    <button class="action-btn text-red-500 hover:bg-red-50 hover-lift" onclick="deleteFile(${material.id})" title="Apagar"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Função para renderizar a tabela de líderes
async function renderLiderancaTable() {
    const tbody = document.getElementById('liderancaTableBody');
    tbody.innerHTML = adminLeaders.map((leader, index) => `
        <tr style="animation: fadeIn 0.3s ease forwards; animation-delay: ${index * 0.05}s; opacity: 0;">
            <td class="font-bold text-dark flex align-center gap-2">
                <div class="author-icon"><i class="fa-solid fa-user"></i></div>
                ${leader.nome}
            </td>
            <td><span class="text-sm font-medium text-gray-700">${leader.cargo}</span></td>
            <td class="text-gray-500">${leader.email}</td>
            <td>
                <div class="flex gap-2">
                    <button class="action-btn text-blue-500 hover:bg-blue-50 hover-lift" onclick="editLeader(${leader.id})" title="Editar"><i class="fa-solid fa-edit"></i></button>
                    <button class="action-btn text-red-500 hover:bg-red-50 hover-lift" onclick="deleteLeader(${leader.id})" title="Revogar Acesso"><i class="fa-solid fa-user-xmark"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Função para deletar arquivo
window.deleteFile = async function (id) {
    if (confirm('Tem certeza que deseja apagar este arquivo?')) {
        try {
            await deleteMaterial(id);
            showToast('Arquivo apagado.', 'error');
            await refreshMateriais();
        } catch (error) {
            console.error("Erro ao deletar arquivo:", error);
            showToast('Erro ao remover arquivo.', 'error');
        }
    }
};

// Expõe downloadMaterial globalmente para os botões gerados dinamicamente via innerHTML
window.downloadMaterial = async function (id, filename) {
    try {
        await downloadMaterial(id, filename);
        window.showToast(`Download de "${filename}" iniciado!`, 'success');
    } catch (error) {
        console.error("Erro ao baixar material:", error);
        window.showToast('Erro ao baixar o arquivo.', 'error');
    }
};

// Abre o modal de edição de material preenchido com dados atuais
window.editFile = function (id) {
    const material = adminSlides.find(m => m.id == id); // == para evitar mismatch de tipo
    if (!material) {
        console.warn('Material não encontrado para id:', id, '| adminSlides:', adminSlides);
        window.showToast('Não foi possível carregar os dados. Tente recarregar a página.', 'error');
        return;
    }

    document.getElementById('editFileId').value = material.id;
    document.getElementById('editFileTitle').value = material.titulo_material;
    document.getElementById('editFileAuthor').value = material.autor_material;
    document.getElementById('editFileCategory').value = material.categoria_material;

    // Reseta o campo de arquivo para evitar envio indevido de upload anterior
    const editFileInput = document.getElementById('editFileUpload');
    if (editFileInput) editFileInput.value = '';
    const zone = document.getElementById('editFileUploadZone');
    const nameEl = document.getElementById('editFileUploadName');
    if (zone && nameEl) {
        zone.classList.remove('has-file');
        nameEl.textContent = '';
        const icon = zone.querySelector('.file-upload-icon i');
        if (icon) icon.className = 'fa-solid fa-file-arrow-up';
        const text = zone.querySelector('.file-upload-text');
        if (text) text.textContent = 'Clique para substituir o arquivo (opcional)';
    }

    document.getElementById('editFileModal').classList.remove('hidden');
};

// Abre o modal de edição de líder preenchido com dados atuais
window.editLeader = function (id) {
    const leader = adminLeaders.find(l => l.id == id); // == para evitar mismatch de tipo
    if (!leader) {
        console.warn('Líder não encontrado para id:', id, '| adminLeaders:', adminLeaders);
        window.showToast('Não foi possível carregar os dados. Tente recarregar a página.', 'error');
        return;
    }

    document.getElementById('editLeaderId').value = leader.id;
    document.getElementById('editLeaderName').value = leader.nome;
    document.getElementById('editLeaderRole').value = leader.cargo;
    document.getElementById('editLeaderEmail').value = leader.email;

    document.getElementById('editLeaderModal').classList.remove('hidden');
};

// Função para deletar líder
window.deleteLeader = async function (id) {
    if (confirm('Tem certeza que deseja revogar o acesso a este líder?')) {
        try {
            await deleteLider(id);
            showToast('Acesso revogado.', 'error');
            await refreshLideres();
        } catch (error) {
            console.error("Erro ao deletar líder:", error);
            showToast('Erro ao remover líder.', 'error');
        }
    }
};

// Função para buscar e filtrar arquivos
async function setupAcervoSearchAndFilter() {
    const searchInput = document.getElementById('adminSearchInput');
    const categorySelect = document.getElementById('adminCategoryFilter');

    async function filterData() {
        if (!adminSlides) return;

        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value.toLowerCase();

        const filtered = adminSlides.filter(material => {
            const matchSearch = material.titulo_material.toLowerCase().includes(searchTerm) ||
                material.autor_material.toLowerCase().includes(searchTerm);

            const materialCategory = (material.categoria_material || "").toLowerCase();
            const matchCat = category === 'todos' || materialCategory === category;

            return matchSearch && matchCat;
        });

        renderAcervoTable(filtered);
    }

    searchInput.addEventListener('input', filterData);
    categorySelect.addEventListener('change', filterData);
}

async function setupMobileSidebar() {
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

async function setupModals() {
    // --- File Upload Zones - Interatividade ---
    function setupFileZone(inputId, zoneId, nameId, iconId) {
        const input = document.getElementById(inputId);
        const zone = document.getElementById(zoneId);
        const nameEl = document.getElementById(nameId);
        if (!input || !zone || !nameEl) return;

        input.addEventListener('change', () => {
            if (input.files && input.files[0]) {
                nameEl.textContent = input.files[0].name;
                zone.classList.add('has-file');
                const icon = zone.querySelector('.file-upload-icon i');
                if (icon) {
                    icon.className = 'fa-solid fa-circle-check';
                }
                const text = zone.querySelector('.file-upload-text');
                if (text) text.textContent = 'Arquivo selecionado!';
            } else {
                resetFileZone(zone, nameEl, 'Clique para selecionar um arquivo');
            }
        });
    }

    function resetFileZone(zone, nameEl, defaultText = 'Clique para selecionar um arquivo') {
        if (!zone || !nameEl) return;
        zone.classList.remove('has-file');
        nameEl.textContent = '';
        const icon = zone.querySelector('.file-upload-icon i');
        if (icon) icon.className = 'fa-solid fa-file-arrow-up';
        const text = zone.querySelector('.file-upload-text');
        if (text) text.textContent = defaultText;
    }

    setupFileZone('fileUpload', 'fileUploadZone', 'fileUploadName');
    setupFileZone('editFileUpload', 'editFileUploadZone', 'editFileUploadName');

    // --- Modal de Criação de Material ---
    const uploadForm = document.getElementById('uploadForm');
    const submitUploadBtn = document.getElementById('submitUploadBtn');

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitUploadBtn.innerHTML;
        submitUploadBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
        submitUploadBtn.disabled = true;

        try {
            const titulo_material = document.getElementById('fileTitle').value;
            const categoria_material = document.getElementById('fileCategory').value;
            const autor_material = document.getElementById('fileAuthor').value;
            const fileInput = document.getElementById('fileUpload');

            const formData = new FormData();
            formData.append('titulo_material', titulo_material);
            formData.append('categoria_material', categoria_material);
            formData.append('autor_material', autor_material);
            if (fileInput && fileInput.files[0]) {
                formData.append('material', fileInput.files[0]);
            }

            await createMaterial(formData);

            await refreshMateriais();

            showToast(`Arquivo "${titulo_material}" adicionado!`, 'success');
            document.getElementById('uploadModal').classList.add('hidden');
            uploadForm.reset();
            const zone = document.getElementById('fileUploadZone');
            const nameEl = document.getElementById('fileUploadName');
            if (zone && nameEl) {
                zone.classList.remove('has-file');
                nameEl.textContent = '';
                const icon = zone.querySelector('.file-upload-icon i');
                if (icon) icon.className = 'fa-solid fa-file-arrow-up';
                const text = zone.querySelector('.file-upload-text');
                if (text) text.textContent = 'Clique para selecionar um arquivo';
            }
        } catch (error) {
            console.error("Erro ao criar material:", error);
            showToast('Erro ao salvar arquivo.', 'error');
        } finally {
            submitUploadBtn.innerHTML = originalText;
            submitUploadBtn.disabled = false;
        }
    });

    // --- Modal de Edição de Material ---
    const editFileForm = document.getElementById('editFileForm');
    const submitEditFileBtn = document.getElementById('submitEditFileBtn');

    editFileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitEditFileBtn.innerHTML;
        submitEditFileBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
        submitEditFileBtn.disabled = true;

        try {
            const id = parseInt(document.getElementById('editFileId').value);
            const formData = new FormData();
            formData.append('titulo_material', document.getElementById('editFileTitle').value);
            formData.append('categoria_material', document.getElementById('editFileCategory').value);
            formData.append('autor_material', document.getElementById('editFileAuthor').value);
            const fileInput = document.getElementById('editFileUpload');
            if (fileInput && fileInput.files[0]) {
                formData.append('material', fileInput.files[0]);
            }

            await updateMaterial(id, formData);

            await refreshMateriais();

            showToast('Material atualizado com sucesso!', 'success');
            document.getElementById('editFileModal').classList.add('hidden');
            editFileForm.reset();
        } catch (error) {
            console.error('Erro ao editar material:', error);
            showToast('Erro ao atualizar material.', 'error');
        } finally {
            submitEditFileBtn.innerHTML = originalText;
            submitEditFileBtn.disabled = false;
        }
    });

    // --- Modal de Criação de Líder ---
    const addLeaderForm = document.getElementById('addLeaderForm');
    const submitLeaderBtn = document.getElementById('submitLeaderBtn');

    addLeaderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitLeaderBtn.innerHTML;
        submitLeaderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Criando acesso...';
        submitLeaderBtn.disabled = true;

        try {
            const nome = document.getElementById('leaderName').value;
            const cargo = document.getElementById('leaderRole').value;
            const email = document.getElementById('leaderEmail').value;


            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                showToast("Email inválido, insira um email válido", "error");
                return;
            }

            const nomeRegex = /^[A-Za-zÀ-ÖØ-öçÇ ]+$/;
            if (!nome || !nomeRegex.test(nome)) {
                showToast("Nome inválido, insira um nome válido", "error");
                return;
            }

            const cargoRegex = /^[A-Za-zÀ-ÖØ-öçÇ\s().\-\/]+$/;
            if (!cargo || !cargoRegex.test(cargo)) {
                showToast("Cargo inválido, insira um cargo válido", "error");
                return;
            }

            await createLider({ nome, cargo, email });

            await refreshLideres();

            showToast(`Acesso criado para ${nome}!`, 'success');
            document.getElementById('addLeaderModal').classList.add('hidden');
            addLeaderForm.reset();
        } catch (error) {
            showToast("Erro ao criar líder", "error");
        } finally {
            submitLeaderBtn.innerHTML = originalText;
            submitLeaderBtn.disabled = false;
        }
    });

    // --- Modal de Edição de Líder ---
    const editLeaderForm = document.getElementById('editLeaderForm');
    const submitEditLeaderBtn = document.getElementById('submitEditLeaderBtn');

    editLeaderForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalText = submitEditLeaderBtn.innerHTML;
        submitEditLeaderBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
        submitEditLeaderBtn.disabled = true;

        try {
            const id = parseInt(document.getElementById('editLeaderId').value);
            const nome = document.getElementById('editLeaderName').value;
            const cargo = document.getElementById('editLeaderRole').value;
            const email = document.getElementById('editLeaderEmail').value;
            const senha = document.getElementById('editLeaderPassword').value;

            const payload = { nome, cargo, email };
            if (senha) payload.senha = senha; // senha é opcional na edição

            await updateLider(id, payload);

            await refreshLideres();

            showToast(`Líder "${nome}" atualizado!`, 'success');
            document.getElementById('editLeaderModal').classList.add('hidden');
        } catch (error) {
            console.error('Erro ao editar líder:', error);
            showToast('Erro ao atualizar líder.', 'error');
        } finally {
            submitEditLeaderBtn.innerHTML = originalText;
            submitEditLeaderBtn.disabled = false;
        }
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', initAdmin);