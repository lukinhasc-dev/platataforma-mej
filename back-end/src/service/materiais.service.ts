import db from '../db'
import { Material } from '../models/material.modal'

export const getAll = async () => {
    const result = await db.query("SELECT * FROM material")
    return result.rows
}

export const create = async (material: Material) => {
    if (!material.titulo_material || !material.categoria_material || !material.autor_material || !material.link_material) {
        throw new Error("Todos os campos são obrigatórios")
    }

    const result = await db.query("INSERT INTO material (titulo_material, categoria_material, autor_material, link_material) VALUES ($1, $2, $3, $4) RETURNING *",
        [material.titulo_material, material.categoria_material, material.autor_material, material.link_material])

    return result.rows[0]
}

export const update = async (id: number, material: Material) => {
    const result = await db.query("UPDATE material SET titulo_material = $1, categoria_material = $2, autor_material = $3, link_material = $4 WHERE id = $5 RETURNING *",
        [material.titulo_material, material.categoria_material, material.autor_material, material.link_material, id])

    if (result.rows.length === 0) {
        throw new Error("Material não encontrado.")
    }

    return result.rows[0]
}

export const getById = async (id: number) => {
    const result = await db.query("SELECT * FROM material WHERE id = $1", [id])

    if (result.rows.length === 0) {
        throw new Error("Material não encontrado.")
    }

    return result.rows[0]
}

export const remove = async (id: number) => {
    const result = await db.query("DELETE FROM material WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
        throw new Error("Material não encontrado.")
    }

    return result.rows[0]
}
