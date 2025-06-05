
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, ImageIcon, MessageSquare, Coins, FileText, Settings, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HelpItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const helpItems: HelpItem[] = [
  {
    title: 'ניהול לקוחות',
    description: 'הוסף, ערוך וצפה בפרטי הלקוחות שלך. שמור היסטוריית תורים ומידע חשוב.',
    href: '/clients',
    icon: <Users className="h-5 w-5" />
  },
  {
    title: 'יומן ותורים',
    description: 'נהל את לוח הזמנים שלך, קבע תורים חדשים ועקוב אחר הפגישות הקרובות.',
    href: '/scheduling',
    icon: <Calendar className="h-5 w-5" />
  },
  {
    title: 'גלריית עבודות',
    description: 'העלה תמונות מהעבודות שלך, בנה פורטפוליו מקצועי ושתף עם לקוחות.',
    href: '/portfolio',
    icon: <ImageIcon className="h-5 w-5" />
  },
  {
    title: 'שיווק ומדיה חברתית',
    description: 'צור תכנים לרשתות חברתיות, נהל קמפיינים ושלח הודעות ללקוחות.',
    href: '/social-media',
    icon: <MessageSquare className="h-5 w-5" />
  },
  {
    title: 'ניהול הוצאות',
    description: 'עקוב אחר ההוצאות העסקיות שלך, צרף קבלות וקבל דוחות פיננסיים.',
    href: '/expenses',
    icon: <Coins className="h-5 w-5" />
  },
  {
    title: 'דוחות ותובנות',
    description: 'צפה בדוחות מפורטים על הביצועים העסקיים וקבל תובנות חשובות.',
    href: '/reports',
    icon: <FileText className="h-5 w-5" />
  }
];

export const HelpContent = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">איך להשתמש במערכת?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          הנה מדריך מהיר לתכונות העיקריות במערכת. לחץ על כל תכונה כדי להתחיל להשתמש בה.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {helpItems.map((item) => (
          <Card key={item.href} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  {item.icon}
                </div>
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {item.description}
              </p>
              <Link to={item.href}>
                <Button variant="outline" className="w-full">
                  התחל להשתמש
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            הגדרות המערכת
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            התאם את המערכת לצרכים שלך - נהל משתמשים, הגדר הרשאות ואופן את המערכת לעבודה מיטבית.
          </p>
          <Link to="/settings">
            <Button>
              פתח הגדרות
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};
