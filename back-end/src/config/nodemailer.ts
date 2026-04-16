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

export const emailConviteTemplate = (nome: string, link: string, tipo: 'convite' | 'recuperacao') => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tipo === 'convite' ? 'Bem-vindo(a) ao Painel MEJ' : 'Redefinição de Senha - MEJ'}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">

  <!-- Preheader oculto (melhora abertura e score anti-spam) -->
  <span style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
    ${tipo === 'convite'
      ? `Olá ${nome}, você foi convidado(a) para fazer parte da equipe de liderança da Missão Evangélica Jaboque.`
      : `Olá ${nome}, recebemos uma solicitação de redefinição de senha para a sua conta na plataforma MEJ.`
    }
  </span>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Container principal -->
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Cabeçalho com identidade visual -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a1628 0%,#2c4a61 100%);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Missão Evangélica Jaboque</h1>
              <p style="margin:8px 0 0;color:#94b8d0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Plataforma Oficial de Liderança</p>
            </td>
          </tr>

          <!-- Barra de destaque colorida -->
          <tr>
            <td style="background-color:${tipo === 'convite' ? '#2c4a61' : '#1e3a52'};height:4px;"></td>
          </tr>

          <!-- Corpo do e-mail -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <!-- Saudação -->
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">${tipo === 'convite' ? '👋 Convite de Acesso' : '🔐 Segurança da Conta'}</p>
              <h2 style="margin:0 0 24px;font-size:26px;color:#0a1628;font-weight:700;line-height:1.3;">
                ${tipo === 'convite' ? `Bem-vindo(a) à equipe, ${nome}!` : `Redefinição de senha`}
              </h2>

              <p style="margin:0 0 16px;font-size:15px;color:#334155;line-height:1.7;">
                Olá, <strong>${nome}</strong>!
              </p>

              <p style="margin:0 0 24px;font-size:15px;color:#334155;line-height:1.7;">
                ${tipo === 'convite'
                  ? 'Você foi selecionado(a) para fazer parte da equipe de liderança da <strong>Missão Evangélica Jaboque</strong>. A sua participação é muito importante para a nossa comunidade. Para começar, clique no botão abaixo e crie a sua senha de acesso ao painel administrativo.'
                  : 'Recebemos uma solicitação de redefinição de senha para a sua conta na plataforma da <strong>Missão Evangélica Jaboque</strong>. Se foi você quem solicitou, clique no botão abaixo para criar uma nova senha de acesso.'
                }
              </p>

              <!-- Botão de ação -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:32px 0;">
                <tr>
                  <td style="background-color:#2c4a61;border-radius:10px;">
                    <a href="${link}" style="display:inline-block;padding:16px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;letter-spacing:0.3px;">
                      ${tipo === 'convite' ? '✅ Criar Minha Senha' : '🔑 Redefinir Minha Senha'}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Aviso de link alternativo -->
              <p style="margin:0 0 8px;font-size:13px;color:#64748b;line-height:1.6;">
                Se o botão acima não funcionar, copie e cole o link abaixo diretamente no seu navegador:
              </p>
              <p style="margin:0 0 24px;font-size:12px;color:#2c4a61;word-break:break-all;background:#f1f5f9;padding:12px;border-radius:8px;border-left:4px solid #2c4a61;">
                ${link}
              </p>

              <!-- Aviso de expiração -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#fef9ec;border-radius:10px;border:1px solid #fde68a;margin-bottom:24px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
                      ⚠️ <strong>Atenção:</strong> Este link é válido por apenas <strong>${tipo === 'recuperacao' ? '10 minutos' : '24 horas'}</strong> e pode ser utilizado somente uma vez. Após esse período, uma nova solicitação deverá ser feita.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Aviso de segurança -->
              <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
                Se você não solicitou este e-mail ou acredita ter recebido por engano, apenas ignore esta mensagem. Nenhuma alteração será feita em sua conta.
              </p>

            </td>
          </tr>

          <!-- Divisor -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;">
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td style="padding:24px 40px 32px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
                Este e-mail foi enviado automaticamente pela plataforma da <strong>Missão Evangélica Jaboque</strong>.
              </p>
              <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">
                R. Engenheiro Wilsom Houk, 91 — Jd. da Glória, São Paulo - SP
              </p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                <a href="https://www.oficialmej.com.br" style="color:#2c4a61;text-decoration:none;">www.oficialmej.com.br</a>
                &nbsp;·&nbsp;
                <a href="mailto:comunicacao.jaboque@gmail.com" style="color:#2c4a61;text-decoration:none;">comunicacao.jaboque@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
