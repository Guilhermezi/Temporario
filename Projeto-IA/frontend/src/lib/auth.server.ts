import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-bytrust";
const JWT_EXPIRES_IN = "7d";

type TokenPayload = {
  id: string;
  email: string;
  name: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function generateResetToken(): string {
  return crypto.randomUUID();
}

export function createAuthCookie(token: string): string {
  const maxAge = 60 * 60 * 24 * 7;
  return `bytrust_token=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}