import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Credenciais do Supabase não encontradas no arquivo .env");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase
