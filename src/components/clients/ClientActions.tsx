
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, MessageSquare, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface ClientActionsProps {
  clientId: string;
  phoneNumber: string;
}

const ClientActions = ({ clientId, phoneNumber }: ClientActionsProps) => {
  const navigate = useNavigate();

  const handleEditClient = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/clients/edit/${clientId}`);
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="size-8"
        onClick={(e) => {
          e.stopPropagation();
          window.open(`tel:${phoneNumber}`, '_blank');
        }}
      >
        <Phone className="size-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        className="size-8"
        onClick={(e) => {
          e.stopPropagation();
          window.open(`sms:${phoneNumber}`, '_blank');
        }}
      >
        <MessageSquare className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="size-8"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => handleEditClient(e)}>
            ערוך פרטים
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clients/${clientId}/activity/new`);
            }}
          >
            הוסף פעילות
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ClientActions;
