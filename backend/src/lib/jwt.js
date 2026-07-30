import { sign, verify } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

export const COOKIE_NAME = 'voxhub_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'None',
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export async function signToken(payload) {
  return sign(payload, JWT_SECRET, 'HS256');
}

export async function verifyToken(token) {
  return verify(token, JWT_SECRET, 'HS256');
}
