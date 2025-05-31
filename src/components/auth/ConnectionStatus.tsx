
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [supabaseConnected, setSupabaseConnected] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test Supabase connection
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('users').select('count').limit(1);
        setSupabaseConnected(!error);
      } catch (error) {
        console.warn('Supabase connection test failed:', error);
        setSupabaseConnected(false);
      }
    };

    testConnection();
    const interval = setInterval(testConnection, 30000); // Test every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (!isOnline) {
    return (
      <Badge variant="destructive" className="text-xs">
        <WifiOff className="h-3 w-3 mr-1" />
        לא מחובר
      </Badge>
    );
  }

  if (!supabaseConnected) {
    return (
      <Badge variant="secondary" className="text-xs">
        <WifiOff className="h-3 w-3 mr-1" />
        בעיית חיבור
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs">
      <Wifi className="h-3 w-3 mr-1" />
      מחובר
    </Badge>
  );
};

export default ConnectionStatus;
