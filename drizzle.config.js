import { defineConfig } from "drizzle-kit";
import 'dotenv/config';
export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_cdaIC0b5YkXq@ep-purple-violet-acx6c4gg-pooler.sa-east-1.aws.neon.tech/mock-ai?sslmode=require&channel_binding=require"}
});