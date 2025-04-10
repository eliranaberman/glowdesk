
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
// These should be set in your Lovable environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
  
  // Use placeholder values for development to prevent app from crashing
  // This allows the app to load, though Supabase functionality won't work
  const devUrl = 'https://placeholder-project.supabase.co';
  const devKey = 'placeholder-key';
  
  // Create and export the client with placeholder values
  export const supabase = createClient(devUrl, devKey);
} else {
  // Create and export the client with proper credentials
  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
}
