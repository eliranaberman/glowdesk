
import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRoutes from './routes';
import { AuthProvider } from '@/contexts/auth';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { initializeStorage } from '@/services/storageService';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [storageInitialized, setStorageInitialized] = useState(false);

  useEffect(() => {
    // Initialize storage buckets
    const initStorage = async () => {
      try {
        await initializeStorage();
        setStorageInitialized(true);
      } catch (error) {
        console.error('Error initializing storage:', error);
        // Continue app initialization even if storage fails
        setStorageInitialized(true);
      }
    };
    
    initStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <AuthProvider>
            <AppRoutes />
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
