import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

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

  const token = await getToken({
    req: { cookies } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
