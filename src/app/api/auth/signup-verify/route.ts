import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken, generateSecureRefreshToken } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const { email, code } = await req.json();

  const pending = await prisma.pendingUser.findUnique({ where: { email } });
  if (!pending) {
    return NextResponse.json({ error: "No pending registration found" }, { status: 404 });
  }

  if (pending.token2FA !== code) {
    return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
  }

  if (new Date() > pending.expiresAt) {
    await prisma.pendingUser.delete({ where: { email } });
    return NextResponse.json({ error: "Verification code expired. Please sign up again." }, { status: 410 });
  }

  const user = await prisma.$transaction(async (tx) => {
    const u = await tx.user.create({
      data: { email: pending.email, password: pending.password },
    });
    await tx.pendingUser.delete({ where: { email } });
    return u;
  });

  const accessToken = await signAccessToken(user.id);
  const refreshToken = generateSecureRefreshToken();

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });
  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
