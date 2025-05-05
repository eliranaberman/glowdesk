
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authRoutes, protectedRoutes, fallbackRoute } from './routes';
import { AuthProvider } from '@/contexts/auth';
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
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth routes */}
            {authRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}
            
            {/* Protected routes */}
            {protectedRoutes.map((route) => (
              <Route 
                key={route.path} 
                path={route.path} 
                element={route.element} 
              />
            ))}
            
            {/* Fallback route */}
            <Route path={fallbackRoute.path} element={fallbackRoute.element} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
