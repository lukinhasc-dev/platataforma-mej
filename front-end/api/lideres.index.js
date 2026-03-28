import api from "./api.js"

export const getAllLideres = async () => {
    const response = await api.get("/lideres")
    return response.data
}

export const createLider = async (lider) => {
    const response = await api.post("/lideres", lider)
    return response.data
}

export const updateLider = async (id, lider) => {
    const response = await api.put(`/lideres/${id}`, lider)
    return response.data
}

export const deleteLider = async (id) => {
    const response = await api.delete(`/lideres/${id}`)
    return response.data
}
