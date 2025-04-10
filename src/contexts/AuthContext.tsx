
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{
    success: boolean;
    error: string | null;
  }>;
  signIn: (email: string, password: string) => Promise<{
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

  useEffect(() => {
    // Check for active session on mount
    const getInitialSession = async () => {
      setIsLoading(true);
      
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
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

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign up a new user
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
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
        return { success: false, error: error.message };
      }

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

  // Sign in an existing user
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

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
      await supabase.auth.signOut();
      toast({
        title: "התנתקות בוצעה בהצלחה",
      });
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
