
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Users, Gift, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SendCouponFormProps {
  onBack: () => void;
}

const SendCouponForm = ({ onBack }: SendCouponFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [couponType, setCouponType] = useState("percentage");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  // Mock clients data
  const topClients = [
    { id: "1", name: "שרה כהן", points: 450, visits: 12, lastVisit: "01/04/2025" },
    { id: "2", name: "אמילי לוי", points: 320, visits: 9, lastVisit: "29/03/2025" },
    { id: "3", name: "ליאת ונג", points: 280, visits: 8, lastVisit: "02/04/2025" },
    { id: "4", name: "דנה ישראלי", points: 240, visits: 7, lastVisit: "25/03/2025" },
    { id: "5", name: "רונית פרץ", points: 210, visits: 6, lastVisit: "27/03/2025" },
  ];

  const handleClientSelection = (clientId: string) => {
    setSelectedClients(prev => {
      if (prev.includes(clientId)) {
        return prev.filter(id => id !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedClients.length === topClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(topClients.map(client => client.id));
    }
  };

  const handleSendCoupons = () => {
    if (selectedClients.length === 0) {
      toast({
        title: "אין לקוחות נבחרים",
        description: "יש לבחור לפחות לקוח אחד לשליחת הקופון",
        variant: "destructive"
      });
      return;
    }

    const selectedCount = selectedClients.length;
    const clientNames = topClients
      .filter(client => selectedClients.includes(client.id))
      .map(client => client.name);
    
    toast({
      title: `הקופון נשלח בהצלחה ל-${selectedCount} לקוחות`,
      description: clientNames.join(", ")
    });
    
    navigate("/loyalty");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center">
        <Button variant="back" size="sm" onClick={onBack} className="ml-2">
          <ArrowRight className="h-4 w-4 ml-1" />
          חזרה
        </Button>
        <h1 className="text-2xl font-bold">שליחת קופון ללקוחות נבחרים</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטי הקופון</CardTitle>
              <CardDescription>הגדרת פרטי הקופון לשליחה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="coupon-name" className="text-sm font-medium">
                  שם הקופון
                </label>
                <Input id="coupon-name" placeholder="לדוגמה: 20% הנחה לחג" />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">סוג ההטבה</label>
                <Select value={couponType} onValueChange={setCouponType}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחרי סוג הטבה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">אחוז הנחה</SelectItem>
                    <SelectItem value="fixed">סכום קבוע</SelectItem>
                    <SelectItem value="free">טיפול חינם</SelectItem>
                    <SelectItem value="bogo">קני אחד קבלי אחד</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {couponType === "percentage" && (
                <div className="grid gap-2">
                  <label htmlFor="percentage" className="text-sm font-medium">
                    אחוז הנחה
                  </label>
                  <Input id="percentage" type="number" placeholder="20" min="1" max="100" />
                </div>
              )}

              {couponType === "fixed" && (
                <div className="grid gap-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    סכום ההנחה (₪)
                  </label>
                  <Input id="amount" type="number" placeholder="50" min="1" />
                </div>
              )}

              {couponType === "free" && (
                <div className="grid gap-2">
                  <label htmlFor="service" className="text-sm font-medium">
                    טיפול חינם
                  </label>
                  <Select defaultValue="manicure">
                    <SelectTrigger id="service">
                      <SelectValue placeholder="בחרי טיפול" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manicure">מניקור</SelectItem>
                      <SelectItem value="pedicure">פדיקור</SelectItem>
                      <SelectItem value="gel">לק ג'ל</SelectItem>
                      <SelectItem value="acrylic">אקריליק</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <label htmlFor="expiry" className="text-sm font-medium">
                  תאריך תפוגה
                </label>
                <Input id="expiry" type="date" />
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium">
                  הודעה אישית (אופציונלי)
                </label>
                <Textarea
                  id="message"
                  placeholder="הוספת מסר אישי לקופון..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>בחירת לקוחות</span>
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  {selectedClients.length === topClients.length ? "נקה הכל" : "בחר הכל"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topClients.map((client) => (
                  <div
                    key={client.id}
                    className="flex items-center justify-between space-x-2 p-2 border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {client.visits} ביקורים, {client.points} נקודות
                      </div>
                    </div>
                    <Checkbox
                      id={`client-${client.id}`}
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => handleClientSelection(client.id)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button onClick={handleSendCoupons} disabled={selectedClients.length === 0}>
              <Send className="ml-2 h-4 w-4" />
              שלח קופונים ({selectedClients.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCouponForm;
