import { createClient } from "@supabase/supabase-js";

// Ambil variabel environment dari file .env.local Anda
// Pastikan nama variabel diawali dengan VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Beri peringatan error jika variabel tidak ada
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL and Anon Key must be provided in your .env.local file."
  );
}

// Inisialisasi dan ekspor klien Supabase
//
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
