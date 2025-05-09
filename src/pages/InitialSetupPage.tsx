
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Loader2,
  Users,
  Settings,
  Facebook
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { assignRole, hasRole, UserRole } from '@/services/userRolesService';
import { Progress } from '@/components/ui/progress';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'error';
  action?: () => void;
  actionLabel?: string;
  link?: string;
  linkLabel?: string;
  icon: React.ElementType;
}

const InitialSetupPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupSteps, setSetupSteps] = useState<SetupStep[]>([
    {
      id: 'admin-role',
      title: 'הגדרת תפקיד מנהל',
      description: 'הגדרת המשתמש הנוכחי כמנהל מערכת',
      status: 'pending',
      action: () => setupAdminRole(),
      actionLabel: 'הגדר כמנהל',
      icon: Users,
    },
    {
      id: 'meta-api',
      title: 'הגדרת Meta API',
      description: 'חיבור חשבון Meta עבור פייסבוק ואינסטגרם',
      status: 'pending',
      link: '/social-media-meta',
      linkLabel: 'הגדרת Meta API',
      icon: Facebook,
    },
    {
      id: 'system-settings',
      title: 'הגדרות מערכת',
      description: 'הגדרת פרטי העסק והגדרות נוספות',
      status: 'pending',
      link: '/settings',
      linkLabel: 'הגדרות מערכת',
      icon: Settings,
    },
  ]);

  useEffect(() => {
    if (user) {
      checkSetupStatus();
    }
  }, [user]);

  useEffect(() => {
    // Calculate progress
    const completed = setupSteps.filter(step => step.status === 'completed').length;
    const total = setupSteps.length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    setSetupProgress(progress);
  }, [setupSteps]);

  const checkSetupStatus = async () => {
    setIsLoading(true);
    try {
      if (!user) return;

      // Check admin role
      const isAdmin = await hasRole(user.id, 'admin');
      updateStepStatus('admin-role', isAdmin ? 'completed' : 'pending');

      // Check Meta API setup
      const { data: accounts, error } = await supabase
        .from('social_media_accounts')
        .select('id')
        .limit(1);
      
      updateStepStatus('meta-api', accounts && accounts.length > 0 ? 'completed' : 'pending');

      // Check system settings (placeholder)
      updateStepStatus('system-settings', 'pending');
      
    } catch (error) {
      console.error('Error checking setup status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStepStatus = (id: string, status: 'pending' | 'completed' | 'error') => {
    setSetupSteps(prev => 
      prev.map(step => 
        step.id === id ? { ...step, status } : step
      )
    );
  };

  const setupAdminRole = async () => {
    if (!user) return;
    
    try {
      updateStepStatus('admin-role', 'pending');
      
      // First assign admin role
      const success = await assignRole(user.id, 'admin');
      
      if (success) {
        // Also assign owner role
        await assignRole(user.id, 'owner');
        
        toast({
          title: "תפקיד הוגדר בהצלחה",
          description: "הוגדרת כמנהל מערכת",
        });
        
        updateStepStatus('admin-role', 'completed');
      } else {
        toast({
          variant: "destructive",
          title: "שגיאה בהגדרת תפקיד",
          description: "אירעה שגיאה בהגדרת תפקיד מנהל",
        });
        
        updateStepStatus('admin-role', 'error');
      }
    } catch (error) {
      console.error('Error setting up admin role:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהגדרת תפקיד",
        description: "אירעה שגיאה בהגדרת תפקיד מנהל",
      });
      
      updateStepStatus('admin-role', 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
      default:
        return <AlertCircle className="h-6 w-6 text-amber-400" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p>בודק סטטוס הגדרות...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>הגדרה ראשונית | GlowDesk</title>
      </Helmet>

      <div className="container mx-auto py-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">הגדרת המערכת</h1>
          <p className="text-muted-foreground mb-6">
            השלם את השלבים הבאים כדי להתחיל להשתמש במערכת
          </p>
          
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>התקדמות</span>
              <span>{setupProgress}%</span>
            </div>
            <Progress value={setupProgress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {setupSteps.map((step) => (
            <Card key={step.id} className={`border ${
              step.status === 'completed' 
                ? 'border-green-200 bg-green-50/50 shadow-sm' 
                : 'shadow-sm'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{step.title}</CardTitle>
                  {getStatusIcon(step.status)}
                </div>
                <CardDescription>
                  {step.description}
                </CardDescription>
              </CardHeader>
              
              <CardFooter className="pt-2 flex justify-end">
                {step.status !== 'completed' && (
                  step.action ? (
                    <Button onClick={step.action}>
                      {step.actionLabel}
                    </Button>
                  ) : step.link ? (
                    <Button variant="outline" onClick={() => navigate(step.link!)}>
                      {step.linkLabel}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : null
                )}
                
                {step.status === 'completed' && (
                  <span className="text-sm font-medium text-green-600">הושלם</span>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {setupProgress === 100 && (
          <Alert className="bg-green-50 border-green-200 mt-8">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>כל ההגדרות הושלמו!</AlertTitle>
            <AlertDescription>
              המערכת הוגדרה בהצלחה וכעת ניתן להתחיל להשתמש בכל התכונות.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-center mt-8">
          <Button onClick={() => navigate('/dashboard')} size="lg">
            המשך לדשבורד
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InitialSetupPage;
