
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
// These should be set in your Lovable environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
}

// Create and export the client
// If credentials are missing, use placeholder values that allow the app to load
// but Supabase functionality won't work properly until real credentials are provided
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);
