
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2, Phone, Mail, Calendar, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Client } from '@/types/clients';

interface ClientsTableMobileProps {
  clients: Client[];
  onDeleteClient: (id: string) => void;
}

const ClientsTableMobile = ({ clients, onDeleteClient }: ClientsTableMobileProps) => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'lead': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'inactive': return 'לא פעיל';
      case 'lead': return 'ליד';
      default: return status;
    }
  };

  const toggleExpanded = (clientId: string) => {
    setExpandedCard(expandedCard === clientId ? null : clientId);
  };

  return (
    <div className="space-y-3 p-1">
      {clients.map((client) => (
        <Card key={client.id} className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base text-right truncate">
                  {client.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={`text-xs px-2 py-1 ${getStatusColor(client.status || 'active')}`}>
                    {getStatusText(client.status || 'active')}
                  </Badge>
                  {client.phone_number && (
                    <a 
                      href={`tel:${client.phone_number}`}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      aria-label="התקשר"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link 
                      to={`/clients/${client.id}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <Eye className="h-4 w-4" />
                      צפייה
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to={`/clients/edit/${client.id}`}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <Edit className="h-4 w-4" />
                      עריכה
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDeleteClient(client.id)}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    מחיקה
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            <div className="text-sm text-gray-600 space-y-1">
              {client.phone_number && (
                <div className="flex items-center gap-2 text-right">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{client.phone_number}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2 text-right">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              {client.created_at && (
                <div className="flex items-center gap-2 text-right">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span>נוצר: {new Date(client.created_at).toLocaleDateString('he-IL')}</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t">
              <Button asChild variant="outline" size="sm" className="flex-1 h-9">
                <Link to={`/clients/${client.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  צפייה
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 h-9">
                <Link to={`/clients/edit/${client.id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  עריכה
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientsTableMobile;
