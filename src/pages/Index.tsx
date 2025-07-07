
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const { user } = useAuth();
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  
  useEffect(() => {
    console.log("📍 Index component rendered");
    document.title = "Home | GlowDesk";
  }, []);

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!user) {
        setIsCheckingSetup(false);
        return;
      }

      try {
        // Check if user has completed business profile setup
        const { data: profile, error } = await supabase
          .from('business_profiles')
          .select('setup_completed')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking user setup:', error);
        }

        // If no profile exists or setup not completed, redirect to setup
        if (!profile || !profile.setup_completed) {
          setIsNewUser(true);
        }
      } catch (error) {
        console.error('Error in setup check:', error);
      } finally {
        setIsCheckingSetup(false);
      }
    };

    checkUserSetup();
  }, [user]);

  // Show loading while checking setup
  if (isCheckingSetup) {
    return null; // or a loading spinner
  }

  // If not authenticated, go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but new user, go to setup
  if (isNewUser) {
    return <Navigate to="/setup" replace />;
  }

  // If authenticated and setup completed, go to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
