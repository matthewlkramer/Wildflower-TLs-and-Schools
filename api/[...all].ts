import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Use pre-bundled server modules to avoid per-function dependency installs
import { registerRoutes } from './_server/routes.js';
import { setupAuth } from './_server/auth.js';

export const config = { runtime: 'nodejs20.x' };

let appPromise: Promise<express.Express> | null = null;

async function buildApp(): Promise<express.Express> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await setupAuth(app as unknown as any);
  await registerRoutes(app as unknown as any);

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  // Delegate to Express app which serves /api/* routes
  // @ts-ignore - express types are compatible
  return (app as unknown as any)(req, res);
}
