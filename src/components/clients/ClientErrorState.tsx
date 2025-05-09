
import { AlertCircle, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ClientErrorStateProps {
  error: string | null;
}

const ClientErrorState = ({ error }: ClientErrorStateProps) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/clients');
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
      <Button onClick={handleBackClick} variant="back" className="flex gap-2">
        <ChevronRight className="h-4 w-4" />
        חזרה לרשימת הלקוחות
      </Button>
    </div>
  );
};

export default ClientErrorState;
