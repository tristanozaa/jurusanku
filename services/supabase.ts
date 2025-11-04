import { createClient } from "@supabase/supabase-js";

// TODO: Ganti dengan URL dan Anon Key Supabase Anda
// Anda bisa mendapatkannya dari Supabase Dashboard:
// Project Settings > API
const supabaseUrl = "https://qfjbnklgonqowetdwmjn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmamJua2xnb25xb3dldGR3bWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjczMTUsImV4cCI6MjA3Nzg0MzMxNX0.CgOMvvaK5FJo08zRdX4OMZ6e5IyhWYEkHnUBRGe8WGE";

if (
  supabaseUrl === "YOUR_SUPABASE_URL" ||
  supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY"
) {
  // This is a placeholder check. In a real app, you would use environment variables.
  // We log a warning to ensure the developer updates these values.
  console.warn(
    "Peringatan: URL dan Anon Key Supabase belum dikonfigurasi. Silakan perbarui file 'services/supabase.ts' dengan kredensial proyek Anda agar aplikasi berfungsi."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
