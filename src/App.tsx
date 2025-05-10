
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { initializeStorage } from '@/services/storageService';
import { HelmetProvider } from 'react-helmet-async';
import './App.css';

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
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
