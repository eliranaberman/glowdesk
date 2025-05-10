
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
          <p>לא נמצאו לקוחות</p>
          <Button variant="outline" size="sm" onClick={() => navigate('/clients/new')}>
            הוסף לקוח חדש
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;
