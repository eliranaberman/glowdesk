
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes';
import { Toaster } from '@/components/ui/toaster';
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
        <RouterProvider router={router} />
        <Toaster />
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
