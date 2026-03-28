import api from "./api.js"

export const getAllMateriais = async () => {
    const response = await api.get("/material")
    return response.data
}

export const createMaterial = async (formData) => {
    const response = await api.post("/material", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

export const updateMaterial = async (id, material) => {
    const response = await api.put(`/material/${id}`, material, {
        headers: { "Content-Type": "multipart/form-data" }
    })
    return response.data
}

export const deleteMaterial = async (id) => {
    const response = await api.delete(`/material/${id}`)
    return response.data
}

export const downloadMaterial = async (id, filename = 'material') => {
    const response = await api.get(`/material/download/${id}`, {
        responseType: 'blob'
    });
    
    // Pegamos o tipo original do arquivo (pdf, ppt, jpeg) vindo do servidor
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Se o filename não tiver ponto (extensão), o navegador pode dar problema
    // mas deixando vazio o navegador costuma usar o Content-Disposition do servidor
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
