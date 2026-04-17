import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // Equivalente ao SMTPSecure = 'ssl'
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Equivalente ao SMTPAuth = true
  },
});

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const from = process.env.SMTP_FROM || 'Skeleton App <noreply@skeleton.app>';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Redefinição de Senha</h2>
      <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #1976d2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Redefinir Senha
        </a>
      </div>
      <p>Se você não solicitou esta alteração, pode ignorar este email com segurança.</p>
      <p>O link expirará em 1 hora.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 12px;">Se o botão não funcionar, copie e cole este link no seu navegador:</p>
      <p style="color: #666; font-size: 12px; word-break: break-all;">${resetUrl}</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to,
    subject: 'Redefinição de Senha - Skeleton App',
    html,
  });
}
