import { getCookie } from 'hono/cookie';
import { verifyToken, COOKIE_NAME } from '../lib/jwt.js';

export async function auth(c, next) {
  const token = getCookie(c, COOKIE_NAME);
  if (token) {
    try {
      const payload = await verifyToken(token);
      c.set('userId', payload.userId);
      c.set('userEmail', payload.email);
    } catch {
      // Invalid token — proceed as guest
    }
  }
  await next();
}
