import { Request, Response } from 'express'
import { getAll, create, update, remove, getById, recordDownload } from '../service/materiais.service'
import path from 'path'
import supabase from '../config/supabase'

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'materiais'

// Faz upload do buffer para o Supabase Storage e retorna a URL pública
async function uploadToSupabase(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname)
    const filename = `${Date.now()}${ext}`

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        })

    if (error) throw new Error(`Erro no upload: ${error.message}`)

    // Retorna a URL pública (bucket público)
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    return data.publicUrl
}

// Remove um arquivo do Supabase Storage pela URL pública
async function deleteFromSupabase(publicUrl: string): Promise<void> {
    try {
        // Extrai o nome do arquivo da URL pública
        const filename = publicUrl.split('/').pop()
        if (!filename) return
        await supabase.storage.from(BUCKET).remove([filename])
    } catch {
        // Não bloqueia a operação se falhar ao deletar
    }
}

export class MaterialController {
    async getAllMateriais(req: Request, res: Response) {
        try {
            const result = await getAll()
            return res.status(200).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async createMaterial(req: Request, res: Response) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Arquivo obrigatório." })
            }

            // Faz upload para o Supabase Storage e obtém a URL pública
            const publicUrl = await uploadToSupabase(req.file)

            const result = await create({
                ...req.body,
                link_material: publicUrl
            })

            return res.status(201).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async updateMaterial(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)

        if (isNaN(idNumber)) {
            return res.status(400).json({ message: "ID inválido" })
        }

        try {
            let linkMaterial = req.body.link_material

            if (req.file) {
                // Novo arquivo: deleta o antigo e faz upload do novo
                const existing = await getById(idNumber)
                if (existing?.link_material) await deleteFromSupabase(existing.link_material)
                linkMaterial = await uploadToSupabase(req.file)
            } else if (!linkMaterial) {
                // Sem arquivo novo: preserva o link atual do banco
                const existing = await getById(idNumber)
                linkMaterial = existing?.link_material
            }

            const result = await update(idNumber, {
                ...req.body,
                link_material: linkMaterial
            })

            return res.status(200).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async removeMaterial(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)

        if (isNaN(idNumber)) {
            return res.status(400).json({ message: "ID inválido" })
        }

        try {
            const existing = await getById(idNumber)
            if (existing?.link_material) {
                await deleteFromSupabase(existing.link_material)
            }

            const result = await remove(idNumber)
            return res.status(200).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async downloadMaterial(req: Request, res: Response) {
        const { id } = req.params
        const idNumber = Number(id)

        if (isNaN(idNumber)) {
            return res.status(400).json({ message: "ID inválido" })
        }

        try {
            await recordDownload(idNumber)

            const material = await getById(idNumber)

            if (!material?.link_material) {
                return res.status(404).json({
                    message: "Este material não possui um arquivo associado."
                })
            }

            return res.redirect(material.link_material)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro ao processar o download"
            })
        }
    }
}