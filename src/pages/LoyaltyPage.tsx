
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgePercent, Gift, User, ArrowRight, Users, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SendCouponForm from "@/components/loyalty/SendCouponForm";

const LoyaltyPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'send-coupon' ? 'send-coupon' : 'promotions';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (searchParams.get('tab') === 'send-coupon') {
      setActiveTab('send-coupon');
    }
  }, [searchParams]);

  // Mock loyalty data
  const activePromotions = [
    { id: "1", name: "קבלי 15% הנחה על טיפול הבא", used: 12, total: 30, expires: "12/05/2025", status: "active", icon: "🌟" },
    { id: "2", name: "מניקור חינם עם פדיקור מלא", used: 8, total: 20, expires: "30/04/2025", status: "active", icon: "🎁" },
    { id: "3", name: "הזמיני 5 טיפולים וקבלי 1 חינם", used: 0, total: 50, expires: "31/05/2025", status: "active", icon: "✨" },
    { id: "4", name: "20% הנחה לחברים חדשים", used: 15, total: 15, expires: "15/03/2025", status: "expired", icon: "💫" },
  ];

  const topClients = [
    { id: "1", name: "שרה כהן", points: 450, visits: 12, nextReward: "טיפול חינם", lastVisit: "01/04/2025" },
    { id: "2", name: "אמילי לוי", points: 320, visits: 9, nextReward: "20% הנחה", lastVisit: "29/03/2025" },
    { id: "3", name: "ליאת ונג", points: 280, visits: 8, nextReward: "טיפול מתנה לחברה", lastVisit: "02/04/2025" },
    { id: "4", name: "דנה ישראלי", points: 240, visits: 7, nextReward: "מניקור חינם", lastVisit: "25/03/2025" },
    { id: "5", name: "רונית פרץ", points: 210, visits: 6, nextReward: "15% הנחה", lastVisit: "27/03/2025" },
  ];

  const createPromotion = () => {
    toast.success("הקופון נוצר בהצלחה");
  };

  const handleBack = () => {
    setActiveTab('promotions');
    setSearchParams({});
  };

  const handleSendCouponToSelectedClients = () => {
    setActiveTab('send-coupon');
    setSearchParams({ tab: 'send-coupon' });
  };

  if (activeTab === 'send-coupon') {
    return <SendCouponForm onBack={handleBack} />;
  }

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BadgePercent className="ml-2 h-6 w-6 text-primary" />
            תוכנית נאמנות
          </h1>
          <p className="text-muted-foreground">
            ניהול קופונים, נקודות ומבצעים ללקוחות שלך
          </p>
        </div>
        <Button onClick={createPromotion}>
          <Gift className="ml-2 h-4 w-4" />
          צור קופון חדש
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">מספר חברי מועדון</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Users className="h-8 w-8 text-primary" />
              <div className="text-right">
                <p className="text-2xl font-bold">52</p>
                <p className="text-xs text-muted-foreground">+4 החודש</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">קופונים פעילים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Gift className="h-8 w-8 text-primary" />
              <div className="text-right">
                <p className="text-2xl font-bold">3</p>
                <p className="text-xs text-muted-foreground">12 מימושים החודש</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">אחוז מימוש קופונים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Clock className="h-8 w-8 text-primary" />
              <div className="text-right">
                <p className="text-2xl font-bold">68%</p>
                <p className="text-xs text-muted-foreground">+5% מהחודש שעבר</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="promotions">מבצעים וקופונים</TabsTrigger>
          <TabsTrigger value="clients">לקוחות מועדון</TabsTrigger>
          <TabsTrigger value="settings">הגדרות תוכנית</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>מבצעים פעילים</CardTitle>
              <CardDescription>ניהול ומעקב אחר הקופונים והמבצעים הפעילים</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם המבצע</TableHead>
                    <TableHead>תאריך תפוגה</TableHead>
                    <TableHead>מימושים</TableHead>
                    <TableHead>סטטוס</TableHead>
                    <TableHead>סמל</TableHead>
                    <TableHead className="text-left">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePromotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.name}</TableCell>
                      <TableCell>{promo.expires}</TableCell>
                      <TableCell>{promo.used} / {promo.total}</TableCell>
                      <TableCell>
                        <Badge variant={promo.status === 'active' ? 'default' : 'secondary'}>
                          {promo.status === 'active' ? 'פעיל' : 'פג תוקף'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-2xl">{promo.icon}</TableCell>
                      <TableCell className="text-left">
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>צור מבצע חדש</CardTitle>
              <CardDescription>יצירת קופון או מבצע חדש ללקוחות</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="promo-name">שם המבצע</Label>
                  <Input id="promo-name" placeholder="לדוגמה: 15% הנחה לטיפול ראשון" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="promo-limit">מספר מימושים</Label>
                    <Input id="promo-limit" placeholder="50" type="number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="promo-expiry">תאריך תפוגה</Label>
                    <Input id="promo-expiry" type="date" />
                  </div>
                </div>
                <Button className="mt-2" onClick={createPromotion}>צור מבצע</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>לקוחות מובילים במועדון</CardTitle>
                  <CardDescription>הלקוחות עם הכי הרבה נקודות נאמנות</CardDescription>
                </div>
                <Button onClick={handleSendCouponToSelectedClients}>
                  <Gift className="ml-2 h-4 w-4" />
                  שלח קופונים ללקוחות
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>שם</TableHead>
                    <TableHead>ביקורים</TableHead>
                    <TableHead>נקודות</TableHead>
                    <TableHead>ביקור אחרון</TableHead>
                    <TableHead>פרס הבא</TableHead>
                    <TableHead className="text-left">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.visits}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10">
                          {client.points} נקודות
                        </Badge>
                      </TableCell>
                      <TableCell>{client.lastVisit}</TableCell>
                      <TableCell>{client.nextReward}</TableCell>
                      <TableCell className="text-left">
                        <Button variant="ghost" size="sm">
                          שלח הטבה
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות תוכנית הנאמנות</CardTitle>
              <CardDescription>התאם את כללי צבירת הנקודות ומימוש ההטבות</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="points-rate">נקודות לכל ₪1</Label>
                  <Input id="points-rate" defaultValue="1" type="number" min="0.1" step="0.1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="points-threshold">כמות נקודות לפרס</Label>
                  <Input id="points-threshold" defaultValue="500" type="number" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthday-bonus">בונוס יום הולדת (נקודות)</Label>
                  <Input id="birthday-bonus" defaultValue="100" type="number" />
                </div>
                <Button className="mt-2">שמור הגדרות</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoyaltyPage;
