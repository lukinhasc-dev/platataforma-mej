import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || 'DesenvolvimentoMEJ@2026';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    // Aceita token via cookie (produção) ou Authorization header (chamadas da API no frontend)
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = cookieToken || bearerToken;

    if (!token) {
        return res.status(401).json({ message: 'Não autenticado.' });
    }

    try {
        jwt.verify(token, SECRET);
        next();
    } catch {
        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
}