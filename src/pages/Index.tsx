
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    console.log("📍 Index component rendered");
    document.title = "Home | Salon Management System";
  }, []);

  // Redirect to the dashboard if authenticated, otherwise to login
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
