import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit нь Next.js-ээс гадуур ажилладаг тул .env.local-ийг өөрөө уншина (CI дээр файл байхгүй, env-ээс авна).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  // Migration-д шууд (pooler биш) холболт хэрэгтэй
  dbCredentials: { url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL! },
});
