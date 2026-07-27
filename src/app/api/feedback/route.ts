import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();

  if (!firstName || !lastName || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  await prisma.feedback.create({
    data: { firstName, lastName, email, subject, message },
  });

  const adminEmail = process.env.ALLOWED_ADMIN_EMAIL || "arjun610705@gmail.com";

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: adminEmail,
      subject: `New Feedback: ${subject}`,
      text: `From: ${firstName} ${lastName} (${email})\nSubject: ${subject}\n\n${message}`,
      html: `<p><strong>From:</strong> ${firstName} ${lastName} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message}</p>`,
    });
  } catch {
    // Email notification is optional; feedback is already saved
  }

  return NextResponse.json({ success: true });
}
