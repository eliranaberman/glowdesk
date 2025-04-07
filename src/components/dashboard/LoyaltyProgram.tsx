
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgePercent, Gift, Users, Send } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const LoyaltyProgram = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock loyalty data
  const activePromotions = [
    { id: "1", name: "קבלי 15% הנחה על טיפול הבא", used: 12, total: 30, expires: "12/05/2025" },
    { id: "2", name: "מניקור חינם עם פדיקור מלא", used: 8, total: 20, expires: "30/04/2025" },
    { id: "3", name: "הזמיני 5 טיפולים וקבלי 1 חינם", used: 0, total: 50, expires: "31/05/2025" },
  ];

  const topClients = [
    { id: "1", name: "שרה כהן", points: 450, visits: 12, nextReward: "טיפול חינם" },
    { id: "2", name: "אמילי לוי", points: 320, visits: 9, nextReward: "20% הנחה" },
    { id: "3", name: "ליאת ונג", points: 280, visits: 8, nextReward: "טיפול מתנה לחברה" },
  ];

  const claimedRewards = [
    { id: "1", clientName: "נופר רז", reward: "מניקור חינם", date: "01/04/2025" },
    { id: "2", clientName: "דניאלה גיא", reward: "הנחה של 20%", date: "29/03/2025" },
  ];

  const sendPromotion = () => {
    toast.success("הקופון נשלח ללקוחות נבחרים");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <BadgePercent className="h-5 w-5 ml-2 text-primary" />
              תוכנית נאמנות
            </CardTitle>
            <CardDescription>
              ניהול הטבות ומעקב אחר נקודות נאמנות
            </CardDescription>
          </div>
          <Link to="/loyalty">
            <Button variant="ghost" size="sm" className="gap-1">
              לכל הנתונים
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
            <TabsTrigger value="clients">לקוחות נאמנים</TabsTrigger>
            <TabsTrigger value="promotions">הטבות פעילות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-3 bg-muted/20 flex justify-between">
                <div>
                  <p className="text-sm font-medium">קופונים פעילים</p>
                  <p className="text-2xl font-bold">{activePromotions.length}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
              </div>
              
              <div className="border rounded-lg p-3 bg-muted/20 flex justify-between">
                <div>
                  <p className="text-sm font-medium">לקוחות במועדון</p>
                  <p className="text-2xl font-bold">52</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">מבצעים פעילים</h3>
              <div className="space-y-3">
                {activePromotions.map((promo) => (
                  <div key={promo.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm">{promo.name}</p>
                      <p className="text-xs text-muted-foreground">פג תוקף: {promo.expires}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-xs font-medium">{promo.used} / {promo.total}</p>
                      <Progress value={(promo.used / promo.total) * 100} className="h-1 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button className="w-full" onClick={sendPromotion}>
              <Send className="h-4 w-4 ml-2" />
              שלח קופון ללקוחות נבחרים
            </Button>
          </TabsContent>
          
          <TabsContent value="clients">
            <div className="space-y-3">
              {topClients.map((client) => (
                <div key={client.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <div className="flex gap-2 items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        {client.visits} ביקורים
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {client.points} נקודות
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm">
                      שלח הטבה
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="promotions">
            <div className="space-y-3">
              {activePromotions.map((promo) => (
                <div key={promo.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{promo.name}</h3>
                    <Badge variant={promo.used > 0 ? "secondary" : "outline"}>
                      {promo.used > 0 ? "פעיל" : "חדש"}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">ניצול:</span>
                      <span>{promo.used}/{promo.total}</span>
                    </div>
                    <Progress value={(promo.used / promo.total) * 100} className="h-2" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">פג תוקף: {promo.expires}</p>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                <Gift className="h-4 w-4 ml-2" />
                צור הטבה חדשה
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
