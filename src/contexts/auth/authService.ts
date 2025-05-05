import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Define the Toast type to match what's returned by useToast hook
type Toast = ReturnType<typeof useToast>['toast'];

export const signUpUser = async (
  email: string, 
  password: string, 
  fullName: string,
  toast: Toast
) => {
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

export const signInUser = async (
  email: string, 
  password: string, 
  rememberMe: boolean,
  toast: Toast
) => {
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

export const signOutUser = async (toast: Toast) => {
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

export const resetUserPassword = async (email: string, toast: Toast) => {
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

export const updateUserPassword = async (password: string, toast: Toast) => {
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
      error: 'התרחשה שגיאה בעדכ��ן הסיסמה. אנא נסו שוב מאוחר יותר.' 
    };
  }
};
