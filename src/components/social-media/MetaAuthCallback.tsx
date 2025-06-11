
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { completeMetaAuth } from '@/services/socialMediaService';
import { Loader2 } from 'lucide-react';

const MetaAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        toast({
          title: "שגיאה בחיבור",
          description: `חיבור Meta נכשל: ${error}`,
          variant: "destructive",
        });
        // Remove the URL parameters
        window.history.replaceState({}, '', '/social-media');
        return;
      }

      if (code && state) {
        try {
          const result = await completeMetaAuth(code, state);
          
          if (result.success) {
            toast({
              title: "חיבור Meta הושלם בהצלחה",
              description: "החשבונות שלך חוברו בהצלחה לפלטפורמה",
            });
          } else {
            toast({
              title: "שגיאה בחיבור Meta",
              description: result.error || "אירעה שגיאה לא צפויה",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          toast({
            title: "שגיאה בחיבור Meta",
            description: "אירעה שגיאה בתהליך החיבור",
            variant: "destructive",
          });
        }
        
        // Clean up URL parameters
        window.history.replaceState({}, '', '/social-media');
        // Reload the page to refresh the connected accounts
        window.location.reload();
      }
    };

    if (searchParams.get('auth') === 'meta') {
      handleCallback();
    }
  }, [searchParams, toast]);

  if (searchParams.get('auth') === 'meta') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>מעבד חיבור Meta...</span>
        </div>
      </div>
    );
  }

  return null;
};

export default MetaAuthCallback;
