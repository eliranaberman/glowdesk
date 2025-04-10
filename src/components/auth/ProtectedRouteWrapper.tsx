
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

// This is a wrapper that adds logging around the protected route component
const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("🔒 ProtectedRouteWrapper rendered");
    console.log("🔑 Authentication status being checked");
  }, []);

  return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default ProtectedRouteWrapper;
