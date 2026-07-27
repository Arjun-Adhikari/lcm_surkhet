import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generate2FACode(): string {
  return crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 6);
}

export function generateSecureRefreshToken(): string {
  return crypto.randomBytes(40).toString("hex");
}

export async function signAccessToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}
