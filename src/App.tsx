
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authRoutes, protectedRoutes, fallbackRoute } from './routes';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { initializeStorage } from '@/services/storageService';
import './App.css';

function App() {
  useEffect(() => {
    // Initialize storage buckets
    const initStorage = async () => {
      await initializeStorage();
    };
    
    initStorage();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
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
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
