
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log("🔒 ProtectedRoute - Auth state:", { 
      userId: user?.id, 
      isAuthenticated: !!user, 
      isLoading,
      currentPath: location.pathname
    });
    
    // Show toast message if redirected due to unauthorized access
    if (!isLoading && !user && location.state?.from) {
      toast({
        title: "נדרשת התחברות",
        description: "אנא התחברו כדי לצפות בדף זה",
        variant: "destructive",
      });
    }
  }, [isLoading, user, location.state, toast, location.pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    console.log("🔄 Auth is still loading...");
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-72 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    console.log("🚫 User not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show children if authenticated
  console.log("✅ User authenticated, showing protected content");
  return <>{children}</>;
};

export default ProtectedRoute;
