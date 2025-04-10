
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Save } from 'lucide-react';

// Define form schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "סיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { updatePassword } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  
  // Check for token in URL
  useEffect(() => {
    const hasToken = searchParams.has('access_token');
    if (!hasToken) {
      setTokenError(true);
    }
  }, [searchParams]);

  // Initialize form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { success, error } = await updatePassword(values.password);
      
      if (success) {
        setResetComplete(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        form.setError('root', { 
          message: error || 'אירעה שגיאה באיפוס הסיסמה. אנא נסו שוב.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If token is missing, show error
  if (tokenError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl mb-2">קישור לא תקין</CardTitle>
            <CardDescription>
              הקישור לאיפוס הסיסמה אינו תקין או שפג תוקפו. אנא בקשו קישור חדש.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/forgot-password')} className="gap-2">
              בקש קישור חדש
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If reset is complete, show success message
  if (resetComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl mb-2">הסיסמה עודכנה בהצלחה!</CardTitle>
            <CardDescription>
              הסיסמה שלך עודכנה בהצלחה. אתם מועברים לדף ההתחברות.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button onClick={() => navigate('/login')} className="gap-2">
              למסך התחברות
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl mb-2">איפוס סיסמה</CardTitle>
          <CardDescription>
            צרו סיסמה חדשה לחשבון שלכם
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סיסמה חדשה</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="הזינו סיסמה חדשה"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימות סיסמה</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="אמתו את הסיסמה החדשה"
                          type={showConfirmPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.formState.errors.root && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                שמור סיסמה חדשה
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
