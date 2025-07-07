import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Sparkles, Phone, MapPin, Clock } from 'lucide-react';

const setupSchema = z.object({
  businessName: z.string().min(2, { message: 'שם העסק חייב להכיל לפחות 2 תווים' }),
  businessPhone: z.string().min(9, { message: 'מספר טלפון חייב להכיל לפחות 9 ספרות' }),
  businessAddress: z.string().optional(),
  businessHours: z.string().optional(),
});

type SetupFormValues = z.infer<typeof setupSchema>;

const SetupPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SetupFormValues>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      businessName: user?.user_metadata?.business_name || '',
      businessPhone: user?.user_metadata?.phone || '',
      businessAddress: '',
      businessHours: 'ראשון-חמישי: 09:00-18:00',
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onSubmit = async (values: SetupFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Save business profile
      const { error } = await supabase
        .from('business_profiles')
        .upsert({
          user_id: user.id,
          business_name: values.businessName,
          business_phone: values.businessPhone,
          business_address: values.businessAddress || '',
          business_hours: { text: values.businessHours || '' },
          setup_completed: true,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "הגדרת העסק הושלמה בהצלחה!",
        description: "ברוכה הבאה ל-GlowDesk",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving business profile:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירת הנתונים",
        description: "אנא נסו שוב מאוחר יותר",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warmBeige/20 via-background to-softRose/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-elevated">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-softRose/20 to-roseGold/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-roseGold" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-display">
            ברוכה הבאה ל-GlowDesk!
          </CardTitle>
          <CardDescription className="text-base sm:text-lg">
            בואי נשלים את הגדרת העסק שלך בכמה צעדים קצרים
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-roseGold" />
                      שם העסק
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="סטודיו יופי שלי"
                        disabled={isLoading}
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-roseGold" />
                      מספר טלפון העסק
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="050-1234567"
                        type="tel"
                        disabled={isLoading}
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-roseGold" />
                      כתובת העסק (אופציונלי)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="רחוב הרצל 123, תל אביב"
                        disabled={isLoading}
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-roseGold" />
                      שעות פעילות (אופציונלי)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="ראשון-חמישי: 09:00-18:00&#10;שישי: 09:00-14:00&#10;שבת: סגור"
                        disabled={isLoading}
                        className="text-base resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full text-base py-6"
                variant="premium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 ml-2" />
                    בואי נתחיל!
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupPage;