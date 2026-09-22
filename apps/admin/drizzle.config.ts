import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import path from 'path';

// Load .env.local from the workspace root
config({ path: path.resolve(process.cwd(), '../../.env.local') });

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
