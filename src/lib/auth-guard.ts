import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth-utils";

function parseCookies(header: string | null): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!header) return cookies;
  header.split(";").forEach((pair) => {
    const [key, ...val] = pair.trim().split("=");
    if (key) cookies[key.trim()] = val.join("=");
  });
  return cookies;
}

export async function requireAuth(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie"));

  // Check next-auth session (Google OAuth)
  const session = await getToken({
    req: { cookies } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (session) return null;

  // Check custom access_token (email/password auth)
  const accessToken = cookies["access_token"];
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
