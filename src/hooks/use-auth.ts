
import { useState } from 'react';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const useAuth = () => {
  // Dummy auth implementation - would connect to your auth provider in a real app
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email && password) {
      setUser({
        id: '1',
        name: 'חן מזרחי',
        email: email,
        role: 'owner'
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    setIsLoading(false);
  };

  const isAuthenticated = (): boolean => {
    return user !== null;
  };

  return {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated
  };
};
