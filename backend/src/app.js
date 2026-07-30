import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { routes } from './routes/index.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use('/api/auth/*', async (c, next) => {
  c.res.headers.set('Vary', 'Origin');
  await next();
});

app.route('/', routes);

export { app };
