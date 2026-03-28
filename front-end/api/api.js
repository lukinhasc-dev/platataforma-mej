const api = axios.create({
    baseURL: "http://localhost:3000/api", //Alterar depois para a URL do Deploy do backend (config.js), o banco de dados mantém.

    headers: {
        "Content-Type": "application/json",
    },
})

export default api