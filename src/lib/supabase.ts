
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fall back to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njjxqxluxtyechxgtwsq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qanhxeGx1eHR5ZWNoeGd0d3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDA2NTQsImV4cCI6MjA1OTQxNjY1NH0.BgfdFH9LspMaEpYADgnl2vBFQu05Up0A8ggH9XsUHSk';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Log the Supabase connection info for debugging
console.log('Supabase URL:', supabaseUrl);
console.log('Connected to Supabase');
