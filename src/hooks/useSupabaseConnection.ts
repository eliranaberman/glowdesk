
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useSupabaseConnection = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        const { error } = await supabase.from('users').select('count').limit(1);
        setIsConnected(!error);
      } catch (error) {
        console.error('Supabase connection error:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();

    // Test connection every 30 seconds
    const interval = setInterval(testConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return { isConnected, isLoading };
};
