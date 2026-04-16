import db from '../db'
import { Lideres } from '../models/lideres.modal'
import bcrypt from 'bcrypt'

export const getAll = async () => {
    const result = await db.query("SELECT * FROM lideres")
    return result.rows
}

export const create = async (lider: Lideres) => {

    //Preenchimento de todos os campos são obrigatórios
    if (!lider.nome || !lider.email || !lider.cargo) {
        throw new Error("Todos os campos são obrigatórios")
    }

    //Email deve conter @ e .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(lider.email)) {
        throw new Error("Email inválido.")
    }


    //Verificar se o lider já está cadastrado, no banco de dados o email está como UNIQUE!
    const verificarLider = await db.query("SELECT 1 FROM lideres WHERE email = $1", [lider.email])

    if (verificarLider.rows.length > 0) {
        throw new Error("Endereço de email já cadastrado.")
    }

    const salt = 10

    try {
        const result = await db.query("INSERT INTO lideres (nome, email, cargo) VALUES ($1, $2, $3) RETURNING *", [lider.nome, lider.email, lider.cargo])
        return result.rows[0]
    } catch (error: any) {
        if (error.code === '23505') {
            throw new Error("Endereço de email já cadastrado.")
        }

        throw new Error("Erro ao criar lider.")
    }
}

// Gera token no banco e retorna o UUID
export const gerarToken = async (lider_id: number, tipo: 'convite' | 'recuperacao'): Promise<string> => {
    // Invalida tokens anteriores do mesmo tipo para esse líder
    await db.query(
        "UPDATE lider_tokens SET usado = TRUE WHERE lider_id = $1 AND tipo = $2 AND usado = FALSE",
        [lider_id, tipo]
    )
    const expiracao = tipo === 'recuperacao' ? "NOW() + INTERVAL '10 minutes'" : "NOW() + INTERVAL '24 hours'"
    const result = await db.query(
        `INSERT INTO lider_tokens (lider_id, tipo, expira_em) VALUES ($1, $2, ${expiracao}) RETURNING token`,
        [lider_id, tipo]
    )
    return result.rows[0].token
}
// Valida o token e define nova senha
export const definirSenha = async (token: string, novaSenha: string) => {
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!senhaRegex.test(novaSenha)) {
        throw new Error("Senha inválida. Mínimo 8 caracteres, maiúscula, minúscula, número e especial.")
    }
    const tokenRow = await db.query(
        "SELECT * FROM lider_tokens WHERE token = $1 AND usado = FALSE AND expira_em > NOW()",
        [token]
    )
    if (tokenRow.rows.length === 0) throw new Error("Link inválido ou expirado.")
    const { lider_id } = tokenRow.rows[0]
    const hash = await bcrypt.hash(novaSenha, 10)
    await db.query("UPDATE lideres SET senha = $1 WHERE id = $2", [hash, lider_id])
    await db.query("UPDATE lider_tokens SET usado = TRUE WHERE token = $1", [token])
    return { success: true }
}
// Busca líder por email (para recuperação de senha)
export const findByEmail = async (email: string) => {
    const result = await db.query("SELECT * FROM lideres WHERE email = $1", [email])
    return result.rows[0] || null
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

export const login = async (email: string, senha: string) => {

    if (!email || !senha) {
        throw new Error("Email e senha são obrigatórios.")
    }

    const result = await db.query("SELECT * FROM lideres WHERE email = $1", [email])

    if (result.rows.length === 0) {
        throw new Error("Email ou senha incorretos.")
    }

    const lider = result.rows[0]

    // Compara a senha digitada com o hash salvo no banco
    const senhaCorreta = await bcrypt.compare(senha, lider.senha)

    if (!senhaCorreta) {
        throw new Error("Email ou senha incorretos.")
    }

    // Retorna os dados do líder sem expor a senha
    const { senha: _, ...liderSemSenha } = lider
    return liderSemSenha
}
