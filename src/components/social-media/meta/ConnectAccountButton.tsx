
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { initiateMetaAuth, completeMetaAuth } from '@/services/socialMediaService';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram, Loader2 } from 'lucide-react';

interface ConnectAccountButtonProps {
  onSuccess: () => void;
}

const ConnectAccountButton = ({ onSuccess }: ConnectAccountButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authWindow, setAuthWindow] = useState<Window | null>(null);
  const [authState, setAuthState] = useState('');
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    
    try {
      const authData = await initiateMetaAuth();
      
      if (!authData) {
        toast({
          title: 'שגיאה',
          description: 'לא ניתן ליצור קישור עם Meta API',
          variant: 'destructive',
        });
        return;
      }
      
      // Store the state for verification later
      setAuthState(authData.state);
      
      // Open the authentication window
      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authPopup = window.open(
        authData.url,
        'meta-auth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      
      setAuthWindow(authPopup);
      setIsAuthDialogOpen(true);
      
      // Set up listener for the redirect
      window.addEventListener('message', handleAuthCallback);
    } catch (error) {
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה ביצירת הקישור עם Meta API',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAuthCallback = async (event: MessageEvent) => {
    // Check if this is the message we're expecting
    if (event.data && event.data.type === 'meta-auth-callback') {
      window.removeEventListener('message', handleAuthCallback);
      
      const { code, state } = event.data;
      
      // Verify state to prevent CSRF attacks
      if (state !== authState) {
        toast({
          title: 'שגיאת אבטחה',
          description: 'אימות המצב נכשל, אנא נסה שוב',
          variant: 'destructive',
        });
        
        setIsAuthDialogOpen(false);
        if (authWindow) authWindow.close();
        return;
      }
      
      setIsLoading(true);
      
      // Complete the authentication process
      const result = await completeMetaAuth(code, state);
      
      if (result.success) {
        toast({
          title: 'חשבון חובר בהצלחה',
          description: 'החשבון חובר בהצלחה לפלטפורמה',
        });
        
        onSuccess();
      } else {
        toast({
          title: 'שגיאה',
          description: result.error || 'אירעה שגיאה בחיבור החשבון',
          variant: 'destructive',
        });
      }
      
      setIsAuthDialogOpen(false);
      if (authWindow) authWindow.close();
      setIsLoading(false);
    }
  };
  
  const handleCloseDialog = () => {
    window.removeEventListener('message', handleAuthCallback);
    setIsAuthDialogOpen(false);
    if (authWindow) authWindow.close();
  };

  return (
    <>
      <Button 
        onClick={handleConnect}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Facebook className="h-4 w-4" />
            <Instagram className="h-4 w-4" />
          </>
        )}
        חבר חשבון Meta
      </Button>
      
      <Dialog open={isAuthDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>מתחבר לחשבון Meta</DialogTitle>
            <DialogDescription>
              יש להשלים את תהליך ההתחברות בחלון שנפתח. אם החלון לא נפתח, אנא בדוק את חוסם החלונות הקופצים בדפדפן שלך.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleCloseDialog}>
              בטל
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConnectAccountButton;
