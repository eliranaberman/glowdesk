
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

// Define form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'נא להזין כתובת מייל תקינה' }),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים' }),
  rememberMe: z.boolean().optional().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Get the intended destination after login
  const from = (location.state as any)?.from?.pathname || '/';

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const { success, error } = await signIn(
        values.email, 
        values.password, 
        values.rememberMe
      );
      
      if (success) {
        navigate(from, { replace: true });
      } else {
        form.setError('root', { 
          message: error || 'שם משתמש או סיסמה שגויים'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl mb-2">התחברות</CardTitle>
          <CardDescription>
            הזינו את פרטי ההתחברות שלכם כדי להיכנס למערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>דואר אלקטרוני</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>סיסמה</FormLabel>
                <div className="relative">
                  <Input
                    {...form.register('password')}
                    placeholder="הזינו סיסמה"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={togglePasswordVisibility}
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
                {form.formState.errors.password && (
                  <FormMessage>{form.formState.errors.password.message}</FormMessage>
                )}
              </FormItem>

              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox 
                  id="rememberMe" 
                  {...form.register('rememberMe')} 
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm cursor-pointer"
                >
                  זכור אותי
                </Label>
              </div>

              {form.formState.errors.root && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {form.formState.errors.root.message}
                </div>
              )}

              <div className="text-sm text-left">
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  שכחתם סיסמה?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                התחברות
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-2">
          <div className="text-sm text-center">
            אין לכם חשבון?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              הירשמו עכשיו
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
