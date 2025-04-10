
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';

const Index = () => {
  useEffect(() => {
    console.log("📍 Index component rendered, redirecting to dashboard");
  }, []);

  // Redirect to the dashboard
  return <Navigate to="/" replace />;
};

export default Index;
