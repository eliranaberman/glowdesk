
import { useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

// This is a wrapper that adds logging around the protected route component
const ProtectedRouteWrapper = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log("🔒 ProtectedRouteWrapper rendered");
    console.log("🔑 Authentication check starting");
    
    return () => {
      console.log("🔒 ProtectedRouteWrapper unmounting");
    };
  }, []);

  return (
    <div className="protected-route-container">
      <ProtectedRoute>{children}</ProtectedRoute>
    </div>
  );
};

export default ProtectedRouteWrapper;
