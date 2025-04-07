
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Gift, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const LoyaltyProgram = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const handleSendCoupons = () => {
    toast({
      title: "פעולה הושלמה",
      description: "קופונים נשלחו ללקוחות הנבחרים בהצלחה!",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Trophy className="h-5 w-5 ml-2 text-primary" />
              תוכנית נאמנות
            </CardTitle>
          </div>
          <Link to="/loyalty">
            <Button variant="ghost" size="sm" className="gap-1">
              לתוכנית המלאה
              <ArrowRight className="h-4 w-4 mr-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-right">סקירה כללית</TabsTrigger>
            <TabsTrigger value="customers" className="text-right">לקוחות נאמנים</TabsTrigger>
            <TabsTrigger value="promotions" className="text-right">הטבות פעילות</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col p-4 border rounded-lg bg-card">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">לקוחות משתתפים</h4>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-semibold">124</p>
                <p className="text-xs text-muted-foreground">70% מסך הלקוחות</p>
              </div>
              <div className="flex flex-col p-4 border rounded-lg bg-card">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">קופונים שנוצלו</h4>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-semibold">37</p>
                <p className="text-xs text-muted-foreground">בחודש האחרון</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="font-medium">הקופונים הפופולריים ביותר</h3>
              <div className="space-y-3">
                {[
                  { name: "הנחה 20% על טיפול הבא", used: 85 },
                  { name: "טיפול חינם עם חברה", used: 56 },
                  { name: "קנה 3 קבל 1 חינם", used: 42 }
                ].map((coupon, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">{coupon.name}</p>
                      <p className="text-xs text-muted-foreground">{coupon.used} שימושים</p>
                    </div>
                    <Progress value={coupon.used > 70 ? 75 : coupon.used > 50 ? 50 : 30} 
                              className="w-16 h-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "שרה כהן", visits: 24, points: 2400 },
                { name: "לאה אברמוב", visits: 18, points: 1950 },
                { name: "יעל גלעדי", visits: 16, points: 1720 }
              ].map((customer, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.visits} ביקורים</p>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="secondary" className="ml-2">{customer.points} נקודות</Badge>
                    <Button variant="remind" size="xs">
                      שלח תזכורת
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <Button variant="outline" onClick={handleSendCoupons} className="w-full">
                <Send className="h-4 w-4 ml-2" />
                שלח קופון ללקוחות נבחרים
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="promotions" className="space-y-4">
            <div className="grid gap-3">
              {[
                { 
                  name: "הנחה 15%", 
                  description: "לכל הטיפולים עד סוף החודש", 
                  code: "SUMMER15",
                  icon: "🌟"
                },
                { 
                  name: "1+1", 
                  description: "טיפול שני חינם ללקוחות חדשים", 
                  code: "NEWCLIENT",
                  icon: "🎁" 
                },
                { 
                  name: "נקודות כפולות", 
                  description: "בימי שני ורביעי", 
                  code: "DOUBLE",
                  icon: "✨" 
                }
              ].map((promo, i) => (
                <div key={i} className="flex p-3 border rounded-lg hover:bg-accent/10 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{promo.name}</h4>
                      <Badge variant="outline" className="text-xs">{promo.code}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                  </div>
                  <div className="text-2xl flex items-center justify-center w-10">
                    {promo.icon}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-2">
              <Link to="/loyalty" className="w-full">
                <Button variant="default" className="w-full">
                  <Gift className="h-4 w-4 ml-2" />
                  צור הטבה חדשה
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LoyaltyProgram;
