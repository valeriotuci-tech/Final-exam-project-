import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Minimal logging to avoid crashing if env is not set in dev
  console.warn("DATABASE_URL is not set. PostgreSQL pool will be created without a connection string.");
}

export const pool = new Pool({
  connectionString
});
