import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { getDb } from '../db/index.js';
import { signToken, COOKIE_NAME, COOKIE_OPTIONS } from '../lib/jwt.js';

const oauthRoutes = new Hono();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const REDIRECT_URI = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}/api/auth/google/callback`
  : 'http://localhost:3000/api/auth/google/callback';

// GET /api/auth/google — redirect to Google
oauthRoutes.get('/google', (c) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// GET /api/auth/google/callback — handle OAuth response
oauthRoutes.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) {
    return c.redirect(`${FRONTEND_URL}/?error=no_code`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return c.redirect(`${FRONTEND_URL}/?error=token_exchange_failed`);
  }

  const { access_token } = await tokenRes.json();

  // Get user info from Google
  const userRes = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  if (!userRes.ok) {
    return c.redirect(`${FRONTEND_URL}/?error=userinfo_failed`);
  }

  const googleUser = await userRes.json();

  // Upsert user in database
  const sql = getDb();
  const [user] = await sql`
    INSERT INTO users (email, name, google_id, avatar_url)
    VALUES (${googleUser.email}, ${googleUser.name}, ${googleUser.id}, ${googleUser.picture})
    ON CONFLICT (google_id) DO UPDATE
      SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
    RETURNING id, email, name, avatar_url, created_at
  `;

  // Sign JWT and set cookie
  const token = await signToken({ userId: user.id, email: user.email });
  setCookie(c, COOKIE_NAME, token, COOKIE_OPTIONS);

  return c.redirect(FRONTEND_URL);
});

export { oauthRoutes };
