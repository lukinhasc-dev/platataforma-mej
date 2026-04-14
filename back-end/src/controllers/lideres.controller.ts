import { Request, Response } from 'express'
import { getAll, create, update, remove, login } from '../service/lideres.service'
import jwt from 'jsonwebtoken'

export class LideresController {
    async getAllLideres(req: Request, res: Response) {
        try {
            const result = await getAll()
            return res.status(200).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async createLider(req: Request, res: Response) {
        try {
            const result = await create(req.body)
            return res.status(201).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async updateLider(req: Request, res: Response) {
        const { id } = req.params

        const idNumber = Number(id)
        if (isNaN(idNumber)) {
            return res.status(400).json({
                message: "ID inválido"
            })
        }

        try {
            const result = await update(idNumber, req.body)
            return res.status(200).json(result)
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async removeLider(req: Request, res: Response) {
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

    async loginLider(req: Request, res: Response) {
        try {
            const { email, senha } = req.body
            const lider = await login(email, senha)

            const token = jwt.sign({ id: lider.id, email: lider.email }, process.env.JWT_SECRET!, { expiresIn: '1d' })

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // false em dev (localhost é HTTP)
                sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            })

            return res.status(200).json({ success: true, lider, token })
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message || "Email ou senha incorretos."
            })
        }
    }
}