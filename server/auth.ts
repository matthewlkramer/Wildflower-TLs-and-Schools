import {
  discovery,
  buildAuthorizationUrl,
  authorizationCodeGrant,
  randomPKCECodeVerifier,
  calculatePKCECodeChallenge,
  randomState,
  randomNonce,
} from 'openid-client';
import session from 'express-session';
import type { Express, Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import MemoryStoreFactory from 'memorystore';

type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
};

let oidcConfig: any | null = null; // openid-client Configuration
let codeStore = new Map<string, string>(); // state -> { codeVerifier, nonce }

export async function setupAuth(app: Express) {
  const {
    COOKIE_SECRET,
    SESSION_SECRET,
    AUTH_BASE_URL: AUTH_BASE_URL_ENV,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    ALLOWED_GOOGLE_DOMAIN = 'wildflowerschools.org',
    NODE_ENV,
  } = process.env as Record<string, string | undefined>;

  const SECRET = COOKIE_SECRET || SESSION_SECRET;
  const AUTH_BASE_URL =
    AUTH_BASE_URL_ENV || `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 5000}`;

  if (!SECRET) throw new Error('Missing COOKIE_SECRET or SESSION_SECRET');
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) throw new Error('Missing Google OAuth env vars');

  const MemoryStore = MemoryStoreFactory(session);

  app.use(
    session({
      secret: SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: NODE_ENV === 'production',
      },
      store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 }),
    })
  );

  // Discover Google's OpenID configuration and initialize client configuration
  oidcConfig = await discovery(new URL('https://accounts.google.com'), GOOGLE_CLIENT_ID!, GOOGLE_CLIENT_SECRET);

  // Initiate login via Google
  app.get('/api/auth/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const codeVerifier = randomPKCECodeVerifier();
      const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
      const state = randomState();
      const nonce = randomNonce();

      // Keep verifier/nonce/state for callback validation (keyed by state)
      codeStore.set(state, JSON.stringify({ codeVerifier, nonce }));

      const authUrl = buildAuthorizationUrl(oidcConfig!, {
        redirect_uri: `${AUTH_BASE_URL}/api/auth/callback`,
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state,
        nonce,
        hd: ALLOWED_GOOGLE_DOMAIN,
        prompt: 'select_account',
      });

      res.redirect(authUrl.toString());
    } catch (err) {
      next(err);
    }
  });

  // OAuth2 callback
  app.get('/api/auth/callback', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const state = (req.query.state as string) || '';
      const stored = codeStore.get(state);
      if (!stored) return res.status(400).send('Invalid state');
      const { codeVerifier, nonce } = JSON.parse(stored);
      codeStore.delete(state);

      const currentUrl = new URL(req.originalUrl, AUTH_BASE_URL);
      const tokens = await authorizationCodeGrant(oidcConfig!, currentUrl, {
        pkceCodeVerifier: codeVerifier,
        expectedNonce: nonce,
        expectedState: state,
      });

      const claims = tokens.claims?.() || {};
      const email = (claims.email as string) || '';
      const name = (claims.name as string) || '';
      const sub = (claims.sub as string) || '';
      const hd = (claims.hd as string) || undefined;

      const allowedDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'wildflowerschools.org').toLowerCase();
      const emailDomain = email.split('@')[1]?.toLowerCase();

      if (!email || emailDomain !== allowedDomain || (hd && hd.toLowerCase() !== allowedDomain)) {
        return res.status(403).send('Only wildflowerschools.org accounts may sign in.');
      }

      // Persist minimal user in session
      const sessionUser: SessionUser = { id: sub, email, name, role: 'user' };
      (req.session as any).user = sessionUser;

      // Redirect back to app root
      res.redirect('/');
    } catch (err) {
      next(err);
    }
  });

  // Establish a server session using a Supabase JWT from the client.
  // This lets the SPA authenticate via Supabase and still use cookie-based
  // requests to the Express API.
  app.post('/api/auth/supabase-session', async (req: Request, res: Response) => {
    try {
      const auth = (req.headers['authorization'] || '').toString();
      const match = auth.match(/^Bearer\s+(.+)$/i);
      if (!match) return res.status(401).json({ message: 'Unauthorized' });
      const jwt = match[1];

      const SUPABASE_URL = process.env.SUPABASE_URL;
      const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
      if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
        return res.status(500).json({ message: 'Server auth not configured' });
      }

      const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
      const { data, error } = await supabase.auth.getUser(jwt);
      if (error || !data?.user) return res.status(401).json({ message: 'Unauthorized' });

      const email = data.user.email || '';
      const name = (data.user.user_metadata as any)?.name || '';
      const sub = data.user.id;
      const allowedDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'wildflowerschools.org').toLowerCase();
      const emailDomain = email.split('@')[1]?.toLowerCase();
      if (!email || emailDomain !== allowedDomain) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const sessionUser: SessionUser = { id: sub, email, name, role: 'user' };
      (req.session as any).user = sessionUser;
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  });

  // Current user
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req.session as any).user as SessionUser | undefined;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    res.json(user);
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ ok: true });
    });
  });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const existing = (req.session as any).user as SessionUser | undefined;
  if (existing) return next();

  // Fallback: allow Supabase JWT via Authorization header
  try {
    const auth = (req.headers['authorization'] || '').toString();
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ message: 'Unauthorized' });
    const jwt = match[1];

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
    if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
      return res.status(500).json({ message: 'Server auth not configured' });
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data, error } = await supabase.auth.getUser(jwt);
    if (error || !data?.user) return res.status(401).json({ message: 'Unauthorized' });

    const email = data.user.email || '';
    const name = (data.user.user_metadata as any)?.name || '';
    const sub = data.user.id;
    const allowedDomain = (process.env.ALLOWED_GOOGLE_DOMAIN || 'wildflowerschools.org').toLowerCase();
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!email || emailDomain !== allowedDomain) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const sessionUser: SessionUser = { id: sub, email, name, role: 'user' };
    (req.session as any).user = sessionUser;
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
