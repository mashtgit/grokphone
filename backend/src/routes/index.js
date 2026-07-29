import { Hono } from 'hono';

const routes = new Hono();

routes.get('/', (c) => c.json({ status: 'ok', service: 'voxhub-api' }));

routes.get('/health', (c) => c.json({ status: 'healthy', timestamp: new Date().toISOString() }));

export { routes };
