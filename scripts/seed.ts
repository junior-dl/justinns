// Resets demo content in the database: `npm run db:seed`
import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { buildSeedStatements } from "./lib/build-seed";

const sql = neon(process.env.DATABASE_URL!);
const statements = await buildSeedStatements();
await sql.transaction(statements.map((s) => sql.query(s)));
console.log(`Seeded ${statements.length} statements.`);
