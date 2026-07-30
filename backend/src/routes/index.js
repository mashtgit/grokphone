import { Hono } from 'hono';
import { authRoutes } from './auth.js';
import { oauthRoutes } from './oauth.js';

const routes = new Hono();

routes.get('/', (c) => c.json({ status: 'ok', service: 'voxhub-api' }));
routes.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

routes.route('/api/auth', authRoutes);
routes.route('/api/auth', oauthRoutes);

export { routes };
