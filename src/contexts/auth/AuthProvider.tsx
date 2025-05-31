
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContextType } from './types';
import { checkAdminStatus } from './authUtils';
import { 
  signUpUser, 
  signInUser, 
  signOutUser, 
  resetUserPassword, 
  updateUserPassword 
} from './authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current user is an admin
  useEffect(() => {
    const performAdminCheck = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const isUserAdmin = await checkAdminStatus(user.id);
        setIsAdmin(isUserAdmin);
        setConnectionError(null);
      } catch (error) {
        console.error('Admin check failed:', error);
        setConnectionError('בעיה בבדיקת הרשאות משתמש');
      }
    };

    performAdminCheck();
  }, [user]);

  useEffect(() => {
    console.log("🔐 AuthProvider initialized");
    
    // Check for active session on mount
    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        console.log("🔄 Fetching initial session...");
        // Get current session with retry logic
        let retries = 3;
        let session = null;
        
        while (retries > 0 && !session) {
          const { data: { session: sessionData }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error fetching session:', error);
            retries--;
            if (retries > 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            setConnectionError('בעיה בחיבור למערכת האימות');
          } else {
            session = sessionData;
            setConnectionError(null);
          }
          break;
        }
        
        if (session) {
          console.log("✅ Session found:", session.user.email);
        } else {
          console.log("ℹ️ No active session found");
        }
        
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Unexpected error during auth initialization:', error);
        setConnectionError('שגיאה בלתי צפויה באתחול המערכת');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth subscription for real-time monitoring
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setConnectionError(null);
        
        if (event === 'SIGNED_OUT') {
          // Redirect to login when user signs out
          navigate('/login');
          toast({
            title: "התנתקות בוצעה בהצלחה",
            description: "להתראות!",
          });
        } else if (event === 'SIGNED_IN') {
          // Navigate to dashboard on sign in if already on login page
          if (location.pathname === '/login' || location.pathname === '/register') {
            navigate('/dashboard');
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Session token refreshed successfully');
        }
        
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location.pathname]);

  // Auth methods wrapper with better error handling
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const result = await signUpUser(email, password, fullName, toast);
      if (!result.success && result.error) {
        setConnectionError(result.error);
      }
      return result;
    } catch (error) {
      const errorMessage = 'שגיאה בהרשמה למערכת';
      setConnectionError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      const result = await signInUser(email, password, rememberMe, toast);
      if (!result.success && result.error) {
        setConnectionError(result.error);
      }
      return result;
    } catch (error) {
      const errorMessage = 'שגיאה בהתחברות למערכת';
      setConnectionError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await signOutUser(toast);
      setConnectionError(null);
    } catch (error) {
      setConnectionError('שגיאה בהתנתקות מהמערכת');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await resetUserPassword(email, toast);
      if (!result.success && result.error) {
        setConnectionError(result.error);
      }
      return result;
    } catch (error) {
      const errorMessage = 'שגיאה באיפוס סיסמה';
      setConnectionError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const result = await updateUserPassword(password, toast);
      if (!result.success && result.error) {
        setConnectionError(result.error);
      }
      return result;
    } catch (error) {
      const errorMessage = 'שגיאה בעדכון סיסמה';
      setConnectionError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    connectionError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
