
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InactiveClientsAlert = () => {
  const { toast } = useToast();
  
  // Sample inactive clients data
  const inactiveClients = [
    { id: '1', name: 'מיטל אברהם', lastVisit: '60 ימים', treatments: 8 },
    { id: '2', name: 'דנה לוי', lastVisit: '45 ימים', treatments: 12 },
    { id: '3', name: 'רונית כהן', lastVisit: '90 ימים', treatments: 5 },
  ];
  
  const handleSendReminder = (clientName: string) => {
    toast({
      title: "נשלחה תזכורת",
      description: `תזכורת נשלחה ל${clientName} בהצלחה!`,
    });
  };

  return (
    <Card className="border-r-4 border-r-amber-400">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Bell className="h-5 w-5 ml-2 text-amber-500" />
          לקוחות לא פעילים
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-muted-foreground text-sm mb-4">
          הלקוחות הבאים לא ביקרו אצלך מעל 45 ימים. שקלי לשלוח להם הודעה או הצעה מיוחדת.
        </p>
        
        <div className="space-y-3">
          {inactiveClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg bg-accent/10">
              <div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-softRose/40 to-mutedPeach/40 flex items-center justify-center text-sm font-medium ml-2">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">ביקור אחרון: לפני {client.lastVisit}</p>
                  </div>
                </div>
              </div>
              <Button 
                variant="remind" 
                size="xs"
                onClick={() => handleSendReminder(client.name)}
              >
                שלח תזכורת
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InactiveClientsAlert;
