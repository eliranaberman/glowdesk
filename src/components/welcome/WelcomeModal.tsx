
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Users, Calendar, ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen welcome modal before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  const quickActions = [
    {
      title: 'הוסף לקוח ראשון',
      description: 'צור פרופיל ללקוח הראשון שלך',
      href: '/clients/new',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'תזמן פגישה',
      description: 'קבע את התור הראשון ביומן',
      href: '/scheduling/new',
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'הוסף לגלריה',
      description: 'העלה תמונות מעבודותיך',
      href: '/portfolio',
      icon: ImageIcon,
      color: 'bg-purple-500'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            🎉 ברוכה הבאה למערכת הניהול שלך!
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground">
              המערכת מוכנה לעבודה! הנה כמה צעדים ראשונים שיעזרו לך להתחיל:
            </p>
          </div>

          <div className="grid gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.href}
                to={action.href}
                onClick={handleClose}
                className="flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-accent/50 transition-colors border"
              >
                <div className={`p-3 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <div className="bg-gradient-to-r from-warmBeige/30 to-softRose/30 p-4 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">המערכת מוכנה לשימוש</h3>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 mr-7">
              <li>• כל התכונות פעילות ומוכנות לעבודה</li>
              <li>• האתר מותאם למובייל ולמחשב</li>
              <li>• תוכל להתחיל לעבוד עם לקוחות מיד</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleClose} variant="outline" className="flex-1">
              אתחיל מאוחר יותר
            </Button>
            <Link to="/clients/new" className="flex-1">
              <Button onClick={handleClose} className="w-full">
                בואי נתחיל! 🚀
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
