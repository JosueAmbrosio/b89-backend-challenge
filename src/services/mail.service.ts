import { transporter } from "../config/mailer";

export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({
    from: `"Soporte" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <h2>Recuperar contraseña</h2>
    <p>Haz clic en el siguiente enlace:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Este enlace expira en 1 hora.</p>
  `;

  await sendMail(to, "Recuperación de contraseña", html);
}