import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../shared/schema.generated";
import * as loanSchema from "@shared/loan-schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const client = postgres(connectionString);
export const db = drizzle(client, { schema: { ...schema, ...loanSchema } });
