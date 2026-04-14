import { Request, Response } from 'express'
import { getAll, create, update, remove, login, gerarToken, definirSenha, findByEmail } from '../service/lideres.service'
import jwt from 'jsonwebtoken'
import { sendEmail, emailConviteTemplate } from '../config/nodemailer'

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

            const token = await gerarToken(result.id, 'convite')
            const link = `${process.env.FRONTEND_URL}/set-password.html?token=${token}`
            await sendEmail(result.email, 'Convite para o Painel MEJ', emailConviteTemplate(result.nome, link, 'convite'))

            return res.status(201).json({ message: "Líder criado com sucesso! Email de convite enviado." })
        } catch (error: any) {
            return res.status(500).json({
                message: error.message || "Erro interno do servidor"
            })
        }
    }

    async setPassword(req: Request, res: Response) {
        try {
            const { token, senha } = req.body
            if (!token || !senha) return res.status(400).json({ message: "Token e senha são obrigatórios." })
            await definirSenha(token, senha)
            return res.status(200).json({ success: true, message: "Senha definida com sucesso!" })
        } catch (error: any) {
            return res.status(400).json({ message: error.message })
        }
    }


    // POST /api/lideres/forgot-password — Solicitar recuperação
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body
            const lider = await findByEmail(email)
            // Sempre retorna 200 por segurança (não revela se email existe)
            if (!lider) return res.status(200).json({ message: "Se o email existir, você receberá as instruções." })
            const token = await gerarToken(lider.id, 'recuperacao')
            const link = `${process.env.FRONTEND_URL}/set-password.html?token=${token}`
            await sendEmail(lider.email, 'Recuperação de Senha — Painel MEJ', emailConviteTemplate(lider.nome, link, 'recuperacao'))
            return res.status(200).json({ message: "Se o email existir, você receberá as instruções." })
        } catch (error: any) {
            return res.status(500).json({ message: error.message })
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