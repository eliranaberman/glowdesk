
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    console.log("📍 Index component rendered");
    document.title = "Home | Salon Management System";
  }, []);

  // Redirect to the dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
