import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

export async function GET(req: Request) {
  const cookies = parseCookies(req.headers.get("cookie"));

  const session = await getToken({
    req: { cookies } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (session) {
    return NextResponse.json({ authenticated: true, name: session.name, email: session.email });
  }

  const accessToken = cookies["access_token"];
  if (accessToken) {
    const payload = await verifyAccessToken(accessToken);
    if (payload) {
      return NextResponse.json({ authenticated: true });
    }
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
