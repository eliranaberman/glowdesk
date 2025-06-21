
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Facebook, Instagram, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { initiateMetaOAuth, fetchConnectedAccounts, disconnectAccount, MetaAccount } from "@/services/metaIntegrationService";

const MetaConnectionPanel = () => {
  const [accounts, setAccounts] = useState<MetaAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await fetchConnectedAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast({
        title: "שגיאה",
        description: "לא ניתן לטעון את החשבונות המחוברים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const authData = await initiateMetaOAuth();
      if (authData?.authUrl) {
        // Open OAuth URL in new window
        window.open(authData.authUrl, '_blank', 'width=600,height=700');
        
        // Listen for successful connection
        const checkConnection = setInterval(() => {
          loadAccounts().then(() => {
            clearInterval(checkConnection);
          });
        }, 2000);
        
        // Clean up after 2 minutes
        setTimeout(() => clearInterval(checkConnection), 120000);
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "שגיאת חיבור",
        description: "לא ניתן להתחבר לחשבון Meta. נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const success = await disconnectAccount(accountId);
      if (success) {
        await loadAccounts();
        toast({
          title: "החשבון נותק",
          description: "החשבון נותק בהצלחה מהמערכת",
        });
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "לא ניתן לנתק את החשבון. נסה שוב.",
        variant: "destructive"
      });
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'instagram':
        return <Instagram size={16} className="text-pink-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (account: MetaAccount) => {
    if (!account.is_valid) {
      return <Badge variant="destructive" className="gap-1">
        <AlertCircle size={12} />
        לא תקין
      </Badge>;
    }
    
    if (!account.webhook_verified) {
      return <Badge variant="secondary" className="gap-1">
        <AlertCircle size={12} />
        ממתין לאימות
      </Badge>;
    }
    
    return <Badge variant="success" className="gap-1">
      <CheckCircle size={12} />
      מחובר
    </Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">חיבור Meta (Facebook & Instagram)</CardTitle>
        <Button 
          onClick={handleConnect}
          disabled={connecting || loading}
          className="gap-2"
        >
          <ExternalLink size={16} />
          {connecting ? 'מתחבר...' : 'חבר חשבון'}
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : accounts.length > 0 ? (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  {getPlatformIcon(account.platform)}
                  <div>
                    <div className="font-medium">{account.account_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {account.platform === 'facebook' ? 'דף פייסבוק' : 'חשבון עסקי באינסטגרם'}
                    </div>
                    {account.last_error && (
                      <div className="text-xs text-red-600 mt-1">
                        שגיאה: {account.last_error}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(account)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    נתק
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Facebook className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">
              אין חשבונות מחוברים
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              התחבר לחשבון Meta שלך כדי לנהל הודעות מפייסבוק ואינסטגרם במקום אחד
            </p>
            <Button onClick={handleConnect} disabled={connecting}>
              {connecting ? 'מתחבר...' : 'התחבר לחשבון Meta'}
            </Button>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">הרשאות נדרשות:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• ניהול הודעות בדף הפייסבוק</li>
            <li>• גישה לרשימת הדפים</li>
            <li>• ניהול הודעות באינסטגרם</li>
            <li>• גישה בסיסית לאינסטגרם</li>
            <li>• קריאת אינטרקציות בדף</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetaConnectionPanel;
