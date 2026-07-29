import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { routes } from './routes/index.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.route('/', routes);

export { app };
