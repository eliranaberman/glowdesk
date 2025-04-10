
import { useState } from 'react';
import CustomerListView from '@/components/customers/CustomerListView';
import { Helmet } from 'react-helmet-async';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from '@/components/ui/button';

const Customers = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const retryLoading = () => {
    setError(null);
  };

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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>שגיאה בטעינת הלקוחות</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={retryLoading}>נסה שוב</Button>
        </div>
      ) : (
        <CustomerListView onError={handleError} />
      )}
    </div>
  );
};

export default Customers;
