import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  await resend.emails.send({
    from: 'MEJ - Plataforma <contato@oficialmej.com.br>',
    to,
    subject,
    html,
  });
};

export const emailConviteTemplate = (nome: string, link: string, tipo: 'convite' | 'recuperacao') => `
<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:2rem;background:#f8fafc;border-radius:12px">
  <h2 style="color:#0a1628">${tipo === 'convite' ? '👋 Bem-vindo(a) ao Painel MEJ!' : '🔐 Recuperação de Senha'}</h2>
  <p>Olá, <strong>${nome}</strong>!</p>
  <p>${tipo === 'convite'
    ? 'Você foi adicionado(a) como líder no painel de gestão da <strong>Missão Evangélica Jaboque</strong>. Clique no botão abaixo para criar a sua senha de acesso.'
    : 'Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha.'
  }</p>
  <a href="${link}" style="display:inline-block;margin:1.5rem 0;padding:0.875rem 2rem;background:#2c4a61;color:#fff;border-radius:8px;text-decoration:none;font-weight:700">
    ${tipo === 'convite' ? 'Criar Minha Senha' : 'Redefinir Senha'}
  </a>
  <p style="color:#64748b;font-size:0.85rem">Este link expira em <strong>24 horas</strong>. Se não foi você, ignore este email.</p>
</div>
`;
