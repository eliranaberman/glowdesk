
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SendCouponForm = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [couponData, setCouponData] = useState({
    template: '',
    discount: '15',
    message: 'היי {{שם}}, הנה קופון הנחה מיוחד עבורך! קוד קופון: {{קוד_קופון}}. בתוקף עד {{תאריך_תפוגה}}.'
  });

  // Sample client data
  const clients = [
    { id: '1', name: 'שרה כהן', points: 2400, lastVisit: '01/04/2025' },
    { id: '2', name: 'לאה אברמוב', points: 1950, lastVisit: '29/03/2025' },
    { id: '3', name: 'יעל גלעדי', points: 1720, lastVisit: '02/04/2025' },
    { id: '4', name: 'דנה ישראלי', points: 1450, lastVisit: '25/03/2025' },
    { id: '5', name: 'רונית פרץ', points: 1200, lastVisit: '27/03/2025' },
  ];

  const couponTemplates = [
    { id: '1', name: 'הנחה באחוזים', template: 'קבלי {{אחוז}}% הנחה על הטיפול הבא' },
    { id: '2', name: 'טיפול חינם', template: 'קבלי טיפול {{שם_טיפול}} חינם' },
    { id: '3', name: 'מבצע 1+1', template: '1+1 על כל הטיפולים' },
  ];

  const handleSelectAll = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map(c => c.id));
    }
  };

  const handleToggleClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  const handleSendCoupons = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "אין לקוחות נבחרים",
        description: "אנא בחרי לפחות לקוח אחד לשליחת הקופון",
        variant: "destructive"
      });
      return;
    }

    if (!couponData.template) {
      toast({
        title: "שגיאה",
        description: "אנא בחרי תבנית קופון",
        variant: "destructive"
      });
      return;
    }

    const selectedClientsNames = clients
      .filter(client => selectedClients.includes(client.id))
      .map(client => client.name);

    toast({
      title: "נשלח בהצלחה",
      description: `הקופון נשלח ל-${selectedClientsNames.join(', ')}`,
    });

    // Reset form and go back
    setSelectedClients([]);
    onBack();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Send className="h-5 w-5 ml-2" />
            שליחת קופונים ללקוחות
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 ml-2" />
            חזרה
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">בחירת לקוחות</h3>
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {selectedClients.length === clients.length ? 'נקה בחירה' : 'בחר הכל'}
            </Button>
          </div>

          <div className="border rounded-lg divide-y">
            {clients.map((client) => (
              <div 
                key={client.id}
                className={`p-3 flex items-center justify-between ${
                  selectedClients.includes(client.id) ? 'bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={selectedClients.includes(client.id)}
                    onCheckedChange={() => handleToggleClient(client.id)}
                    id={`client-${client.id}`}
                  />
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-softRose/40 to-mutedPeach/40 flex items-center justify-center text-sm font-medium ml-2">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <label 
                        htmlFor={`client-${client.id}`}
                        className="font-medium cursor-pointer"
                      >
                        {client.name}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {client.points} נקודות | ביקור אחרון: {client.lastVisit}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="text-lg font-medium">פרטי הקופון</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="coupon-template">תבנית קופון</Label>
              <Select 
                value={couponData.template} 
                onValueChange={(value) => setCouponData({...couponData, template: value})}
              >
                <SelectTrigger id="coupon-template">
                  <SelectValue placeholder="בחרי סוג קופון" />
                </SelectTrigger>
                <SelectContent>
                  {couponTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="discount">אחוז הנחה</Label>
              <div className="flex items-center">
                <Input
                  id="discount"
                  type="number"
                  min="5"
                  max="50"
                  value={couponData.discount}
                  onChange={(e) => setCouponData({...couponData, discount: e.target.value})}
                />
                <span className="mr-2">%</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="message">הודעה מותאמת אישית</Label>
              <Textarea
                id="message"
                value={couponData.message}
                onChange={(e) => setCouponData({...couponData, message: e.target.message})}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                ניתן להשתמש במשתנים כמו {{'{שם}'}} או {{'{קוד_קופון}'}}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 flex justify-end">
          <Button onClick={handleSendCoupons} disabled={selectedClients.length === 0 || !couponData.template}>
            <Send className="h-4 w-4 ml-2" />
            שלח קופונים ({selectedClients.length} נמענים)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SendCouponForm;
