import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { checkRateLimit } from "@/lib/rate-limit";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function getIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();

  const ip = getIp(req);
  const { allowed, retryAfter } = checkRateLimit(`feedback:${ip}`, 3, 24 * 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

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
