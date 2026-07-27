import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function send2FACode(email: string, code: string): Promise<void> {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Admin Signup Verification Code",
    text: `Your verification code is: ${code}. It expires in 10 minutes.`,
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>It expires in 10 minutes.</p>`,
  });
}
