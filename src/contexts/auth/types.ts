
import { Session, User } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, fullName: string, businessName?: string, phone?: string) => Promise<{
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
