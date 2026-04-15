import { API_URL } from "./config.js";

const token = new URLSearchParams(location.search).get('token');

// Sem token na URL → mostra erro direto
if (!token) {
    document.getElementById('setPasswordForm').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

// Validação visual em tempo real
const senhaInput = document.getElementById('senha');
const confirmarInput = document.getElementById('confirmar');

senhaInput.addEventListener('input', validarRequisitos);
confirmarInput.addEventListener('input', () => validarReq('req-match', senhaInput.value === confirmarInput.value && confirmarInput.value !== ''));

function validarRequisitos() {
    const v = senhaInput.value;
    validarReq('req-len', v.length >= 8);
    validarReq('req-upper', /[A-Z]/.test(v));
    validarReq('req-num', /\d/.test(v));
    validarReq('req-special', /[@$!%*?&]/.test(v));
    if (confirmarInput.value) validarReq('req-match', v === confirmarInput.value);
}

function validarReq(id, ok) {
    const el = document.getElementById(id);
    el.classList.toggle('ok', ok);
    el.classList.toggle('fail', !ok);
    el.querySelector('i').className = ok ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark';
}

function toggleVer(inputId, btn) {
    const input = document.getElementById(inputId);
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
}

// Submit
document.getElementById('setPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senha = senhaInput.value;
    const confirmar = confirmarInput.value;

    if (senha !== confirmar) {
        validarReq('req-match', false);
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/api/lideres/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, senha }),
        });

        const data = await res.json();

        if (res.ok) {
            document.getElementById('setPasswordForm').style.display = 'none';
            document.getElementById('successState').style.display = 'block';
        } else {
            alert(data.message || 'Erro ao definir senha.');
            btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Definir Senha';
            btn.disabled = false;
        }
    } catch {
        alert('Erro de conexão. Tente novamente.');
        btn.innerHTML = '<i class="fa-solid fa-shield-halved"></i> Definir Senha';
        btn.disabled = false;
    }
});