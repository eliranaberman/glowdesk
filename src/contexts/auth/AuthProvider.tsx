
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
      const isUserAdmin = await checkAdminStatus(user.id);
      setIsAdmin(isUserAdmin);
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
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
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

  // Auth methods wrapper
  const signUp = async (email: string, password: string, fullName: string, businessName?: string, phone?: string) => {
    return await signUpUser(email, password, fullName, businessName || '', phone || '', toast);
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    return await signInUser(email, password, rememberMe, toast);
  };

  const signOut = async () => {
    return await signOutUser(toast);
  };

  const resetPassword = async (email: string) => {
    return await resetUserPassword(email, toast);
  };

  const updatePassword = async (password: string) => {
    return await updateUserPassword(password, toast);
  };

  const value = {
    user,
    session,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
