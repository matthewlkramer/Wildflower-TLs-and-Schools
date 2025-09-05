import express from 'express';
// Defer loading bundled server code to runtime (CJS bundles)

let appPromise = null as Promise<express.Express> | null;

async function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Early probe route to verify this catch-all function is mounted
  app.get('/api/_probe', (_req, res) => {
    res.status(200).json({ ok: true, from: 'catch-all', note: 'probe before bundle load' });
  });

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

  try {
    // CommonJS interop: import default and/or named
    const authMod = await import('./_server/auth.cjs');
    const routesMod = await import('./_server/routes.cjs');
    const setupAuth = (authMod as any).setupAuth || (authMod as any).default?.setupAuth;
    const registerRoutes = (routesMod as any).registerRoutes || (routesMod as any).default?.registerRoutes;
    if (typeof setupAuth !== 'function' || typeof registerRoutes !== 'function') {
      console.error('Failed to load server bundles: setupAuth/registerRoutes not found');
      throw new Error('Server bundles missing exports');
    }
    await setupAuth(app as any);
    await registerRoutes(app as any);
  } catch (e: any) {
    console.error('Error initializing bundled server:', e);
    // Expose error via debug endpoint even if bundles fail
    app.get('/api/_debug/routes', (_req, res) => {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    });
    return app;
  }

  // DEBUG: list registered routes to verify mounting works in serverless
  app.get('/api/_debug/routes', (_req, res) => {
    try {
      const routes: any[] = [];
      // @ts-ignore accessing private router stack
      const stack = (app as any)._router?.stack || [];
      for (const layer of stack) {
        if (layer.route && layer.route.path) {
          const methods = Object.keys(layer.route.methods || {}).filter(Boolean);
          routes.push({ path: layer.route.path, methods });
        } else if (layer.name === 'router' && layer.handle?.stack) {
          for (const lr of layer.handle.stack) {
            if (lr.route?.path) {
              const methods = Object.keys(lr.route.methods || {}).filter(Boolean);
              routes.push({ path: lr.route.path, methods });
            }
          }
        }
      }
      res.json({ ok: true, count: routes.length, routes });
    } catch (e: any) {
      res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
  });

  return app;
}

export default async function handler(req: any, res: any) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  // @ts-ignore pass through to Express
  return app(req, res);
}
