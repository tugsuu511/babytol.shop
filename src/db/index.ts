import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Нэг процесст нэг connection pool. Dev горимд hot reload бүрт шинэ pool үүсэхээс сэргийлж globalThis-д хадгална.
// DATABASE_URL нь Neon-ий pooled (-pooler) холболт; migration-д DATABASE_URL_UNPOOLED хэрэглэнэ (drizzle.config.ts).
const g = globalThis as typeof globalThis & { __babytolPool?: Pool };

const pool = (g.__babytolPool ??= new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
}));

export const db = drizzle({ client: pool, schema });
export { schema };
