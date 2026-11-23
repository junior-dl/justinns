import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Neon over HTTP in production; plain node-postgres when DATABASE_URL points at a
// local Postgres (handy for offline development and the e2e test run).
type DB = ReturnType<typeof drizzleNeon<typeof schema>>;
let instance: DB | null = null;

function connect(): DB {
  if (!instance) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    instance = local
      ? (drizzlePg(new Pool({ connectionString: url }), { schema }) as unknown as DB)
      : drizzleNeon(neon(url), { schema });
  }
  return instance;
}

// Lazily connect so `next build` works without a database.
export const db = new Proxy({} as DB, {
  get: (_t, prop) => Reflect.get(connect(), prop),
});

export type { DB };
export { schema };
