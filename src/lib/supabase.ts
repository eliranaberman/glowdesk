
import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials
// In production, these should ideally be set as environment variables
const supabaseUrl = 'https://njjxqxluxtyechxgtwsq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qanhxeGx1eHR5ZWNoeGd0d3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDA2NTQsImV4cCI6MjA1OTQxNjY1NH0.BgfdFH9LspMaEpYADgnl2vBFQu05Up0A8ggH9XsUHSk';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
