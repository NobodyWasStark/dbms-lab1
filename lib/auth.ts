import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

export const AUTH_COOKIE_NAME = 'auth_token';

// Secret key encoded for the Edge runtime and Node environments
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-for-dbms-lab-assignment-2026';
  return new TextEncoder().encode(secret);
};

export interface TokenPayload {
  userId: string;
  email: string;
  fullName: string;
}

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * Compares a plaintext password against a stored bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a JWT using jose (compatible with Next.js Edge Middleware and Node APIs)
 */
export async function signToken(
  payload: TokenPayload,
  rememberMe: boolean = false
): Promise<string> {
  const secret = getJwtSecret();
  // Standard session: 2 hours; Extended remember-me session: 7 days
  const expirationTime = rememberMe ? '7d' : '2h';

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(secret);
}

/**
 * Verifies a JWT and returns the parsed payload, or null if invalid/expired
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
    };
  } catch {
    return null;
  }
}
