import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signAccessToken, generateSecureRefreshToken } from "@/lib/auth-utils";

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  header.split(";").forEach((pair) => {
    const [key, ...val] = pair.trim().split("=");
    if (key) cookies[key.trim()] = val.join("=");
  });
  return cookies;
}

export async function POST(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie"));
  const refreshToken = cookies["refresh_token"];
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || new Date() > stored.expiresAt) {
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } });
    }
    return NextResponse.json({ error: "Invalid or expired refresh token" }, { status: 401 });
  }

  const newAccessToken = await signAccessToken(stored.userId);
  const newRefreshToken = generateSecureRefreshToken();

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.delete({ where: { id: stored.id } });
    await tx.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: stored.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set("access_token", newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60,
    path: "/",
  });
  res.cookies.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
