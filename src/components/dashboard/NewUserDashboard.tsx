import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  UserPlus, 
  Calendar, 
  CreditCard, 
  Package, 
  Settings, 
  Sparkles,
  Heart,
  TrendingUp
} from 'lucide-react';

const NewUserDashboard = () => {
  const quickStartItems = [
    {
      title: "הוסיפי את הלקוחה הראשונה שלך",
      description: "צרי פרופיל ללקוחה החדשה וכל הפרטים הרלוונטיים",
      icon: <UserPlus className="h-6 w-6" />,
      to: "/clients/new",
      variant: "premium" as const,
      priority: 1
    },
    {
      title: "הוסיפי טיפול ראשון",
      description: "תזמני את הפגישה הראשונה בלוח השנה שלך",
      icon: <Calendar className="h-6 w-6" />,
      to: "/scheduling/new",
      variant: "action" as const,
      priority: 2
    },
    {
      title: "הוסיפי הוצאה ראשונה",
      description: "רשמי הוצאה עסקית לתחילת המעקב הפיננסי",
      icon: <CreditCard className="h-6 w-6" />,
      to: "/expenses",
      variant: "success" as const,
      priority: 3
    },
    {
      title: "השלימי את הגדרת העסק שלך",
      description: "הוסיפי פרטים נוספים כמו לוגו ומידע ליצירת קשר",
      icon: <Settings className="h-6 w-6" />,
      to: "/settings",
      variant: "warm" as const,
      priority: 4
    }
  ];

  const statsCards = [
    { 
      title: 'סך הכל לקוחות', 
      value: '0', 
      icon: <UserPlus className="h-5 w-5 text-primary" />, 
      description: 'התחילי עם הלקוחה הראשונה שלך'
    },
    { 
      title: 'פגישות החודש', 
      value: '0', 
      icon: <Calendar className="h-5 w-5 text-primary" />, 
      description: 'קבעי את הפגישה הראשונה'
    },
    { 
      title: 'הכנסה חודשית', 
      value: '₪0', 
      icon: <TrendingUp className="h-5 w-5 text-primary" />, 
      description: 'ההכנסות שלך יופיעו כאן'
    },
    { 
      title: 'פריטי מלאי', 
      value: '0', 
      icon: <Package className="h-5 w-5 text-primary" />, 
      description: 'הוסיפי מוצרים למעקב מלאי'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4" dir="rtl">
      {/* Welcome Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-softRose/20 to-roseGold/20 rounded-full flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-roseGold" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary">
          ברוכה הבאה ל-GlowDesk!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          עכשיו אפשר להתחיל! בצעי את השלבים הבאים כדי להקים את המערכת שלך בצורה מושלמת.
        </p>
      </div>

      {/* Empty Stats - Show zeros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="h-full shadow-soft hover:shadow-elevated transition-all duration-300">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-primary mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-softRose/20 to-roseGold/20 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start Actions */}
      <Card className="shadow-elevated">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-display flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-roseGold" />
            בואי נתחיל יחד!
          </CardTitle>
          <CardDescription className="text-base">
            ביצוע השלבים הבאים יעזור לך להפיק את המיטב מהמערכת
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickStartItems.map((item) => (
              <Link key={item.title} to={item.to} className="block group h-full">
                <Card className="h-full hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1 group-hover:border-softRose/30">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-softRose/20 to-roseGold/20 rounded-full flex items-center justify-center group-hover:from-softRose/30 group-hover:to-roseGold/30 transition-all duration-300">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Button 
                            variant={item.variant} 
                            size="sm" 
                            className="font-medium"
                          >
                            התחילי עכשיו
                          </Button>
                          <span className="text-2xl font-bold text-softRose/30 group-hover:text-softRose/50 transition-colors duration-300">
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-warmBeige/20 via-softRose/10 to-roseGold/20 border-softRose/30">
        <CardContent className="p-8 text-center">
          <h2 className="text-xl font-display font-semibold text-primary mb-4">
            אנחנו כאן בשבילך! 💪
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            זכרי שהמערכת נבנתה במיוחד עבור מניקוריסטיות כמוך. 
            כל תכונה מותאמת לצרכים שלך ותעזור לך לנהל את העסק בצורה הכי יעילה.
            אם יש לך שאלות - אנחנו תמיד כאן לעזור!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserDashboard;