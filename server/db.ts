// server/db.ts
import 'dotenv/config';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

// 1️⃣  create & export the pool
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// 2️⃣  export the drizzle client that wraps it
export const db = drizzle(pool, { schema });
