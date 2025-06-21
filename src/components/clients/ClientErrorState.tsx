
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ClientErrorStateProps {
  error: string | null;
  onBack?: () => void;
}

const ClientErrorState = ({ error, onBack }: ClientErrorStateProps) => {
  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>שגיאה בטעינת פרטי הלקוח</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
      <Button onClick={handleBackClick} variant="back" className="flex gap-1.5">
        <ChevronRight className="h-4 w-4" />
        חזרה לרשימת הלקוחות
      </Button>
    </div>
  );
};

export default ClientErrorState;
