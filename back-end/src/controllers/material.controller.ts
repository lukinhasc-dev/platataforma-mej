import { Request, Response } from 'express'
import { getAll, create, update, remove, getById } from '../service/materiais.service'
import fs from 'fs'
import path from 'path'

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
            const path = req.file?.path;
            const result = await create({
                ...req.body,
                link_material: path || req.body.link_material
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
            return res.status(400).json({
                message: "ID inválido"
            })
        }

        try {
            const path = req.file?.path;
            const result = await update(idNumber, {
                ...req.body,
                link_material: path || req.body.link_material
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
            return res.status(400).json({
                message: "ID inválido"
            })
        }

        try {
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
            return res.status(400).json({
                message: "ID inválido"
            })
        }

        try {
            const material = await getById(idNumber)
            
            if (!material.link_material) {
                return res.status(404).json({
                    message: "Este material não possui um arquivo associado"
                })
            }

            // O link_material agora guarda o path absoluto (ajustado no upload.ts)
            const filePath = material.link_material

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({
                    message: "Arquivo físico não encontrado no servidor"
                })
            }

            return res.download(filePath)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro ao processar o download"
            })
        }
    }
}