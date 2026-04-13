import { API_URL } from "../config.js";

const api = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
})

// Injeta o token em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('mej_token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
});

// Se o token expirar e estiver no painel admin, redireciona para o login
api.interceptors.response.use(
    res => res,
    err => {
        const isAdmin = window.location.pathname.includes('admin');
        if (err.response?.status === 401 && isAdmin) {
            localStorage.removeItem('mej_token');
            window.location.href = '/front-end/index.html';
        }
        return Promise.reject(err);
    }
);

export default api