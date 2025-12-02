import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // In real app you might want better logging; this is minimal
  console.warn("DATABASE_URL is not set. PostgreSQL client will not connect.");
}

export const pool = new Pool({
  connectionString
});
