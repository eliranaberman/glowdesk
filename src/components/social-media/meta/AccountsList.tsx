
import { useState, useEffect } from 'react';
import { SocialMediaAccount } from '@/types/socialMedia';
import { fetchConnectedAccounts, disconnectAccount } from '@/services/socialMediaService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Instagram, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import ConnectAccountButton from './ConnectAccountButton';

interface AccountsListProps {
  onSelectAccount: (account: SocialMediaAccount) => void;
  selectedAccount?: SocialMediaAccount;
}

const AccountsList = ({ onSelectAccount, selectedAccount }: AccountsListProps) => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDisconnect, setConfirmDisconnect] = useState<SocialMediaAccount | null>(null);
  const { toast } = useToast();

  const loadAccounts = async () => {
    setIsLoading(true);
    const data = await fetchConnectedAccounts();
    setAccounts(data);
    setIsLoading(false);
    
    // Auto-select the first account if none is selected
    if (data.length > 0 && !selectedAccount) {
      onSelectAccount(data[0]);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleDisconnect = async () => {
    if (!confirmDisconnect) return;
    
    const result = await disconnectAccount(confirmDisconnect.id);
    
    if (result) {
      toast({
        title: 'החשבון נותק',
        description: `חשבון ${confirmDisconnect.account_name} נותק בהצלחה`,
      });
      
      // If this was the selected account, clear the selection
      if (selectedAccount?.id === confirmDisconnect.id) {
        const remainingAccounts = accounts.filter(a => a.id !== confirmDisconnect.id);
        if (remainingAccounts.length > 0) {
          onSelectAccount(remainingAccounts[0]);
        } else {
          onSelectAccount(undefined as any); // Clear selection if no accounts remain
        }
      }
      
      // Refresh the accounts list
      loadAccounts();
    } else {
      toast({
        title: 'שגיאה',
        description: 'אירעה שגיאה בניתוק החשבון',
        variant: 'destructive',
      });
    }
    
    setConfirmDisconnect(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">חשבונות מחוברים</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAccounts}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
          <ConnectAccountButton onSuccess={loadAccounts} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : accounts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">אין חשבונות מחוברים עדיין</p>
            <ConnectAccountButton onSuccess={loadAccounts} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {accounts.map((account) => (
            <Card 
              key={account.id}
              className={`cursor-pointer hover:bg-accent/10 transition-colors ${
                selectedAccount?.id === account.id ? 'bg-accent/10 border-primary' : ''
              }`}
              onClick={() => onSelectAccount(account)}
            >
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {account.platform === 'facebook' ? (
                    <Facebook className="h-5 w-5 text-blue-600" />
                  ) : (
                    <Instagram className="h-5 w-5 text-pink-600" />
                  )}
                  <div>
                    <p className="font-medium">{account.account_name}</p>
                    <Badge variant="outline" className="mt-1">
                      {account.platform === 'facebook' ? 'פייסבוק' : 'אינסטגרם'}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDisconnect(account);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog open={!!confirmDisconnect} onOpenChange={() => setConfirmDisconnect(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>אישור ניתוק חשבון</DialogTitle>
            <DialogDescription>
              האם אתה בטוח שברצונך לנתק את החשבון {confirmDisconnect?.account_name}? פעולה זו אינה ניתנת לביטול.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmDisconnect(null)}>
              ביטול
            </Button>
            <Button variant="destructive" onClick={handleDisconnect}>
              נתק חשבון
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsList;
