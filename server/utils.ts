// Consolidated server utilities
import type { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import fs from 'fs';
import path from 'path';
import Airtable from "airtable";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';
import * as schema from "../shared/schema.generated";
import * as loanSchema from "@shared/loan-schema";

// =============================================================================
// DATABASE CONNECTION
// =============================================================================

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema: { ...schema, ...loanSchema } });

// =============================================================================
// AIRTABLE BASE
// =============================================================================

export const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

// =============================================================================
// LOGGING
// =============================================================================

const isDevelopment = process.env.NODE_ENV === 'development';

class ServerLogger {
  private enabled: boolean;

  constructor() {
    this.enabled = isDevelopment;
  }

  log(...args: any[]) {
    if (this.enabled) {
      console.log(new Date().toISOString(), '[LOG]', ...args);
    }
  }

  error(...args: any[]) {
    console.error(new Date().toISOString(), '[ERROR]', ...args);
  }

  warn(...args: any[]) {
    if (this.enabled) {
      console.warn(new Date().toISOString(), '[WARN]', ...args);
    }
  }

  debug(...args: any[]) {
    if (this.enabled) {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.enabled) {
      console.info(new Date().toISOString(), '[INFO]', ...args);
    }
  }
}

export const logger = new ServerLogger();

// =============================================================================
// CACHE
// =============================================================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 30 * 60 * 1000; // 30 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    // Invalidate keys matching pattern
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get cache stats for monitoring
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    Array.from(this.cache.values()).forEach((entry) => {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
    };
  }
}

export const cache = new Cache();

// =============================================================================
// AUTHENTICATION
// =============================================================================

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

// =============================================================================
// STATIC FILE SERVING
// =============================================================================

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}