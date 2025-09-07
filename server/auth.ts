import type { Express, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';

export async function setupAuth(app: Express) {
  app.get('/api/auth/me', getMe);
  app.get('/api/_auth/me', getMe);
}

async function getMe(req: Request, res: Response) {
  try {
    const user = await verifyJwt(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    return res.json({ ...user, role: 'user' });
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

async function verifyJwt(req: Request): Promise<{ id: string; email: string; name: string } | null> {
  const auth = (req.headers['authorization'] || '').toString();
  const match = auth.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const jwt = match[1];
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return null;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) return null;
  const email = data.user.email || '';
  const name = (data.user.user_metadata as any)?.name || '';
  const id = data.user.id;
  const allowedDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'wildflowerschools.org').toLowerCase();
  const emailDomain = email.split('@')[1]?.toLowerCase();
  if (!email || emailDomain !== allowedDomain) return null;
  return { id, email, name };
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await verifyJwt(req);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    (req as any).user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

