import express from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registerRoutes } from './_server/routes.js';
import { setupAuth } from './_server/auth.js';

let appPromise: Promise<express.Express> | null = null;

async function buildApp(): Promise<express.Express> {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  await setupAuth(app);
  await registerRoutes(app);

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  // @ts-ignore pass through to Express
  return app(req, res);
}

