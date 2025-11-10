import { createClient } from '@supabase/supabase-js'
import { User } from '../types';

// FIX: Cast import.meta.env to any to bypass TypeScript error when tsconfig is not available.
const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL
const supabaseAnonKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and Anon Key must be provided in .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define a type for our user profiles
export type Profile = User;
