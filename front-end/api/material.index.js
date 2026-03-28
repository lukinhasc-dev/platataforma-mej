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
    const response = await api.put(`/material/${id}`, material)
    return response.data
}

export const deleteMaterial = async (id) => {
    const response = await api.delete(`/material/${id}`)
    return response.data
}

export const downloadMaterial = async (id, filename = 'material') => {
    const response = await api.get(`/material/download/${id}`, {
        responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
}
