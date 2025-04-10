
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';

// Define form schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'נא להזין כתובת מייל תקינה' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Initialize form
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    
    try {
      const { success, error } = await resetPassword(values.email);
      
      if (success) {
        setRequestSent(true);
      } else {
        form.setError('root', { 
          message: error || 'אירעה שגיאה בשליחת מייל איפוס הסיסמה. אנא נסו שוב.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If reset password email sent, show success message
  if (requestSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warmBeige/10 to-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl mb-2">מייל איפוס סיסמה נשלח</CardTitle>
            <CardDescription>
              שלחנו לך מייל עם הוראות לאיפוס הסיסמה. אנא בדקו את תיבת המייל שלכם.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link to="/login">
                <ArrowLeft className="h-4 w-4" />
                חזרה לדף התחברות
              </Link>
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
          <CardTitle className="text-2xl mb-2">שכחתם סיסמה?</CardTitle>
          <CardDescription>
            הזינו את כתובת המייל שלכם ונשלח לכם קישור לאיפוס הסיסמה
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
                  <Send className="h-4 w-4" />
                )}
                שלח מייל איפוס סיסמה
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center">
            <Link to="/login" className="text-primary font-medium hover:underline">
              חזרה לדף התחברות
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
