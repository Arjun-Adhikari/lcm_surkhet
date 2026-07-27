import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generate2FACode } from "@/lib/auth-utils";
import { send2FACode } from "@/lib/nodemailer";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User already registered" }, { status: 409 });
  }

  const hashedPassword = await hashPassword(password);
  const code = generate2FACode();

  await prisma.pendingUser.upsert({
    where: { email },
    update: { password: hashedPassword, token2FA: code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    create: { email, password: hashedPassword, token2FA: code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
  });

  const adminEmail = process.env.ALLOWED_ADMIN_EMAIL || "arjun610705@gmail.com";

  try {
    await send2FACode(adminEmail, code);
  } catch {
    return NextResponse.json({ error: "Failed to send verification email. Check SMTP settings." }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Verification code sent to the admin for approval." });
}
