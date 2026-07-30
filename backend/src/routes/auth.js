import { Hono } from 'hono';
import { setCookie, deleteCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/index.js';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '../lib/jwt.js';
import { auth } from '../middleware/auth.js';

const authRoutes = new Hono();

// POST /api/auth/register
authRoutes.post('/register', async (c) => {
  const { email, password, name } = await c.req.json();

  if (!email || !password || !name) {
    return c.json({ error: 'email, password, and name are required' }, 400);
  }
  if (typeof email !== 'string' || !email.includes('@')) {
    return c.json({ error: 'Invalid email' }, 400);
  }
  if (password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const sql = getDb();
  const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existing.length > 0) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  const password_hash = await bcrypt.hash(password, 10);
  const [user] = await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${password_hash})
    RETURNING id, email, name, avatar_url, created_at
  `;

  const token = await signToken({ userId: user.id, email: user.email });
  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);

  return c.json({ user }, 201);
});

// POST /api/auth/login
authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'email and password are required' }, 400);
  }

  const sql = getDb();
  const [user] = await sql`
    SELECT id, email, name, password_hash, avatar_url, created_at
    FROM users WHERE email = ${email}
  `;

  if (!user || !user.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const token = await signToken({ userId: user.id, email: user.email });
  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
    },
  });
});

// POST /api/auth/logout
authRoutes.post('/logout', (c) => {
  deleteCookie(c, COOKIE_NAME);
  return c.json({ ok: true });
});

// GET /api/auth/me
authRoutes.get('/me', auth, async (c) => {
  const userId = c.get('userId');
  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const sql = getDb();
  const [user] = await sql`
    SELECT id, email, name, avatar_url, created_at
    FROM users WHERE id = ${userId}
  `;

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json({ user });
});

export { authRoutes };
