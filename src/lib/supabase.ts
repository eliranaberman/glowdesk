
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise fall back to hardcoded values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njjxqxluxtyechxgtwsq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qanhxeGx1eHR5ZWNoeGd0d3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDA2NTQsImV4cCI6MjA1OTQxNjY1NH0.BgfdFH9LspMaEpYADgnl2vBFQu05Up0A8ggH9XsUHSk';

// Create and export the Supabase client with enhanced auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'glowdesk-auth-token',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  global: {
    // Increase timeout for calendar sync operations that might take longer
    fetch: (url: string | URL | Request, options: RequestInit = {}) => {
      const timeout = (options.headers as Record<string, string>)?.['x-supabase-function'] ? 30000 : 10000;
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      // Merge the timeout signal with any existing signal
      const signal = options.signal 
        ? AbortSignal.any([controller.signal, options.signal])
        : controller.signal;
      
      return fetch(url, { 
        ...options, 
        signal 
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Log the Supabase connection info for debugging
console.log('🔗 Supabase URL:', supabaseUrl);
console.log('✅ Connected to Supabase');

// Enhanced calendar auth redirect handler
export const handleCalendarAuthRedirect = () => {
  // Check if this is a redirect from OAuth provider (Google, Microsoft, etc)
  const params = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const state = params.get('state');
  
  if (accessToken && state) {
    try {
      // Parse the state to get calendar type and other info
      const stateData = JSON.parse(decodeURIComponent(state));
      
      // Store tokens in localStorage temporarily
      // In production, these should be immediately sent to your server/edge function
      localStorage.setItem('calendar_auth_tokens', JSON.stringify({
        accessToken,
        refreshToken,
        expiresAt: Date.now() + 3600000, // 1 hour from now
        calendarType: stateData.calendarType,
        email: stateData.email,
        timestamp: new Date().toISOString()
      }));
      
      // Redirect to the calendar configuration page
      window.location.href = '/scheduling?auth=success';
    } catch (error) {
      console.error('Error handling calendar auth redirect:', error);
      // Redirect to the calendar page with error
      window.location.href = '/scheduling?auth=error';
    }
  }
};

// Check if this is a calendar auth redirect and handle it
if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
  handleCalendarAuthRedirect();
}

// Connection monitoring
let connectionRetries = 0;
const MAX_RETRIES = 3;

export const testSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.warn('Supabase connection test failed:', error);
      return false;
    }
    connectionRetries = 0; // Reset retries on success
    return true;
  } catch (error) {
    connectionRetries++;
    console.error(`Supabase connection attempt ${connectionRetries}/${MAX_RETRIES} failed:`, error);
    
    if (connectionRetries >= MAX_RETRIES) {
      console.error('Max connection retries reached. Connection may be unstable.');
    }
    
    return false;
  }
};

// Initialize connection test
if (typeof window !== 'undefined') {
  testSupabaseConnection().then(connected => {
    if (connected) {
      console.log('✅ Supabase connection verified');
    } else {
      console.warn('⚠️ Supabase connection verification failed');
    }
  });
}
