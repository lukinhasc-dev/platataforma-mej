import db from '../db'
import { Lideres } from '../models/lideres.modal'
import bcrypt from 'bcrypt'

export const getAll = async () => {
    const result = await db.query("SELECT * FROM lideres")
    return result.rows
}

export const create = async (lider: Lideres) => {

    //Preenchimento de todos os campos são obrigatórios
    if (!lider.nome || !lider.email || !lider.cargo || !lider.senha) {
        throw new Error("Todos os campos são obrigatórios")
    }

    //Email deve conter @ e .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(lider.email)) {
        throw new Error("Email inválido.")
    }

    //Senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!senhaRegex.test(lider.senha)) {
        throw new Error("Senha inválida. A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.")
    }

    //Verificar se o lider já está cadastrado, no banco de dados o email está como UNIQUE!
    const verificarLider = await db.query("SELECT 1 FROM lideres WHERE email = $1", [lider.email])

    if (verificarLider.rows.length > 0) {
        throw new Error("Endereço de email já cadastrado.")
    }

    const salt = 10
    const hashSenha = await bcrypt.hash(lider.senha, salt)

    try {
        const result = await db.query("INSERT INTO lideres (nome, email, cargo, senha) VALUES ($1, $2, $3, $4) RETURNING *", [lider.nome, lider.email, lider.cargo, hashSenha])
        return result.rows[0]
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error("Endereço de email já cadastrado.")
        }

        throw new Error("Erro ao criar lider.")
    }
}

export const update = async (id: number, lider: Lideres) => {

    let hashSenha = null
    if (lider.senha) {
        const salt = 10
        hashSenha = await bcrypt.hash(lider.senha, salt)
    }

    const result = await db.query("UPDATE lideres SET nome = $1, email = $2, cargo = $3, senha = COALESCE($4, senha) WHERE id = $5 RETURNING *",
        [lider.nome, lider.email, lider.cargo, hashSenha, id])

    if (result.rows.length === 0) {
        throw new Error("Lider não encontrado.")
    }

    return result.rows[0]
}

export const remove = async (id: number) => {
    const result = await db.query("DELETE FROM lideres WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
        throw new Error("Lider não encontrado.")
    }

    return result.rows[0]
}
