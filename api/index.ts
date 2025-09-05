import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
// Import directly from the server source so Vercel bundles it
import { registerRoutes } from '../server/routes';
import { setupAuth } from '../server/auth';

export const config = { runtime: 'nodejs20.x' };

let appPromise: Promise<express.Express> | null = null;

async function buildApp(): Promise<express.Express> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await setupAuth(app);
  await registerRoutes(app); // mounts all /api routes

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  // Delegate to Express
  // @ts-ignore - express types are compatible
  return app(req, res);
}
