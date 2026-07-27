import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generate2FACode } from "@/lib/auth-utils";
import { send2FACode } from "@/lib/nodemailer";
import { checkRateLimit } from "@/lib/rate-limit";

function getIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const ip = getIp(req);
  const { allowed, retryAfter } = checkRateLimit(`signup:${ip}`, 3, 30 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Could not process registration" }, { status: 400 });
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
    return NextResponse.json({ error: "Could not process registration" }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: "Verification code sent to the admin for approval." });
}
