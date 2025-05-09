
import { useState, useEffect } from 'react';
import CustomerListView from '@/components/customers/CustomerListView';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Customers = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        if (!user) {
          setError("יש להתחבר למערכת כדי לצפות ברשימת הלקוחות");
          setLoading(false);
          return;
        }
        
        console.log("Fetching customers for user:", user.id);
        
        const { data, error: supabaseError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id);
          
        if (supabaseError) {
          throw supabaseError;
        }
        
        console.log("Fetched customers:", data);
        setCustomers(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error loading customers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [user]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const retryLoading = () => {
    setError(null);
  };

  const isTableMissingError = error?.includes('relation "public.clients" does not exist');

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <div className="space-y-2 mt-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>ניהול לקוחות | Chen Mizrahi</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">ניהול לקוחות</h1>
        <p className="text-muted-foreground">
          צפה ונהל את רשימת הלקוחות שלך
        </p>
      </div>

      {error ? (
        <div className="space-y-4">
          {isTableMissingError ? (
            <Alert variant="destructive">
              <Database className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת הלקוחות</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>טבלת הלקוחות לא קיימת במסד הנתונים. עליך ליצור טבלה בשם "clients" בסופאבייס.</p>
                <p className="text-sm mt-2">
                  השגיאה המלאה: {error}
                </p>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>שגיאה בטעינת הלקוחות</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={retryLoading}>נסה שוב</Button>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg border">
          <h3 className="text-lg font-medium">אין לקוחות עדיין</h3>
          <p className="text-muted-foreground mt-1 mb-4">התחל/י להוסיף לקוחות חדשים למערכת</p>
          <Button onClick={() => window.location.href = '/customers/new'}>הוסף לקוח/ה חדש/ה</Button>
        </div>
      ) : (
        <CustomerListView customers={customers} onError={handleError} />
      )}
    </div>
  );
};

export default Customers;
