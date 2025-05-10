
import { format } from 'date-fns';
import { TableRow, TableCell } from '@/components/ui/table';
import { Client } from '@/types/clients';
import ClientAvatar from './ClientAvatar';
import StatusBadge from './StatusBadge';
import ClientActions from './ClientActions';

interface ClientTableRowProps {
  client: Client;
  onRowClick: (id: string) => void;
}

const ClientTableRow = ({ client, onRowClick }: ClientTableRowProps) => {
  return (
    <TableRow 
      key={client.id} 
      className="cursor-pointer hover:bg-accent/30"
      onClick={() => onRowClick(client.id)}
    >
      <TableCell>
        <div className="flex items-center gap-2">
          <ClientAvatar client={client} />
          <div>
            <div className="font-medium">{client.full_name}</div>
            <div className="text-xs text-muted-foreground">
              {client.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell dir="ltr" className="text-right">{client.phone_number}</TableCell>
      <TableCell>
        {client.registration_date ? format(new Date(client.registration_date), 'dd/MM/yyyy') : ''}
      </TableCell>
      <TableCell>
        <StatusBadge status={client.status} />
      </TableCell>
      <TableCell>
        {client.assigned_rep_user?.full_name || '-'}
      </TableCell>
      <TableCell>
        <ClientActions 
          clientId={client.id} 
          phoneNumber={client.phone_number} 
        />
      </TableCell>
    </TableRow>
  );
};

export default ClientTableRow;
