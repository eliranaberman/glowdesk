
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Award, Calendar, Clock, Mail, Phone, Plus, Tag, X } from 'lucide-react';
import { Customer } from '@/services/customers';
import { CustomerStatus, LoyaltyLevel } from '@/services/customers/constants';

interface CustomerContactInfoProps {
  customer: Customer;
  isAdmin: boolean;
  openTagDialog: () => void;
  removeTag: (tag: string) => void;
  formatDate: (dateString: string | null) => string;
  getLoyaltyText: (level: string) => string;
  getStatusText: (status: string) => string;
}

const CustomerContactInfo = ({ 
  customer, 
  isAdmin, 
  openTagDialog, 
  removeTag, 
  formatDate,
  getLoyaltyText,
  getStatusText
}: CustomerContactInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי קשר</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center">
          <Mail className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>{customer.email}</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>{customer.phone_number}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>תאריך הצטרפות: {formatDate(customer.registration_date)}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
          <span>תור אחרון: {formatDate(customer.last_appointment)}</span>
        </div>
        
        <Separator />
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Tag className="h-4 w-4 ml-2 text-muted-foreground" />
              <span>תגיות</span>
            </div>
            {isAdmin && (
              <Button variant="ghost" size="sm" onClick={openTagDialog}>
                <Plus className="h-3 w-3 ml-1" />
                הוספה
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {customer.tags && customer.tags.length > 0 ? (
              customer.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {tag}
                  {isAdmin && (
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  )}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">אין תגיות</span>
            )}
          </div>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Award className="h-4 w-4 ml-2 text-muted-foreground" />
            <span>רמת נאמנות: {getLoyaltyText(customer.loyalty_level || '')}</span>
          </div>
          <Badge 
            variant={
              customer.loyalty_level === LoyaltyLevel.GOLD 
                ? 'default' 
                : customer.loyalty_level === LoyaltyLevel.SILVER 
                  ? 'secondary' 
                  : 'outline'
            }
            className={
              customer.loyalty_level === LoyaltyLevel.GOLD 
                ? 'bg-amber-500' 
                : customer.loyalty_level === LoyaltyLevel.SILVER 
                  ? 'bg-gray-300 text-primary' 
                  : 'border-amber-900/20 text-amber-900/70'
            }
          >
            {getLoyaltyText(customer.loyalty_level || '')}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span>סטטוס:</span>
          <Badge variant={
            customer.status === CustomerStatus.ACTIVE 
              ? 'default' 
              : customer.status === CustomerStatus.LEAD
                ? 'warm'
                : 'secondary'
          }>
            {getStatusText(customer.status)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerContactInfo;
