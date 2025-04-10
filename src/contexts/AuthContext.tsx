
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  updatePassword: (password: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          if (window.location.pathname === '/login' || window.location.pathname === '/register') {
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
  }, [navigate, toast]);

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("🔄 Attempting to sign up user:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error("❌ Sign up error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("✅ User signed up successfully:", data);
      
      toast({
        title: "נרשמתם בהצלחה",
        description: "נשלח מייל אימות לכתובת הדוא״ל שלך",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        success: false, 
        error: 'התרחשה שגיאה במהלך ההרשמה. אנא נסו שוב מאוחר יותר.' 
      };
    }
  };

  // Sign in an existing user with Remember Me option
  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      console.log("🔄 Attempting to sign in user:", email);
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("❌ Sign in error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("✅ User signed in successfully:", data.user?.email);
      
      toast({
        title: "התחברות בוצעה בהצלחה",
        description: "ברוכים הבאים לGlowDesk",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        success: false, 
        error: 'התרחשה שגיאה במהלך ההתחברות. אנא נסו שוב מאוחר יותר.' 
      };
    }
  };

  // Sign out the current user
  const signOut = async () => {
    try {
      console.log("🔄 Signing out user");
      await supabase.auth.signOut();
      console.log("✅ User signed out successfully");
      // Toast notification is handled by the auth state change listener
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "שגיאה בהתנתקות",
        variant: "destructive",
      });
    }
  };

  // Send password reset email
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "נשלח קישור לאיפוס סיסמה",
        description: "בדקו את הדוא״ל שלכם לקבלת הנחיות נוספות",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { 
        success: false, 
        error: 'התרחשה שגיאה בשליחת מייל איפוס הסיסמה. אנא נסו שוב מאוחר יותר.' 
      };
    }
  };

  // Update password (used after reset)
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        return { success: false, error: error.message };
      }

      toast({
        title: "הסיסמה עודכנה בהצלחה",
      });

      return { success: true, error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { 
        success: false, 
        error: 'התרחשה שגיאה בעדכון הסיסמה. אנא נסו שוב מאוחר יותר.' 
      };
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
