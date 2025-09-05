import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Defer loading bundled server code to runtime (CJS bundles)

let appPromise: Promise<express.Express> | null = null;

async function buildApp(): Promise<express.Express> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Debug: log incoming API requests (can be removed later)
  app.use((req, _res, next) => {
    try {
      if ((req.url || '').startsWith('/api')) {
        console.log(`[fn] ${req.method} ${req.url}`);
      }
    } catch {}
    next();
  });

  // Ensure incoming URLs include the '/api' prefix to match Express route definitions.
  app.use((req, _res, next) => {
    try {
      const url = req.url || '';
      if (!url.startsWith('/api/')) {
        req.url = url.startsWith('/') ? `/api${url}` : `/api/${url}`;
      }
    } catch {}
    next();
  });

  const { setupAuth } = await import('./_server/auth.cjs');
  const { registerRoutes } = await import('./_server/routes.cjs');
  await setupAuth(app as any);
  await registerRoutes(app as any);

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  // @ts-ignore pass through to Express
  return app(req, res);
}
