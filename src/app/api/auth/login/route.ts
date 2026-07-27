import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signAccessToken, generateSecureRefreshToken } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await comparePassword(password, user.password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

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
