import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Credenciais do Supabase não encontradas no arquivo .env");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export default pool
