
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Camera, Calendar, Users, BarChart3, Smartphone, Star } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Calendar,
      title: 'ניהול תורים חכם',
      description: 'קביעת תורים מתקדמת עם סינכרון ליומן וזיכרונות אוטומטיים'
    },
    {
      icon: Users,
      title: 'ניהול לקוחות מקצועי',
      description: 'מעקב אחר לקוחות, העדפות אישיות והיסטוריית טיפולים'
    },
    {
      icon: Camera,
      title: 'גלריית עבודות',
      description: 'הצגת עבודות מרהיבות ויצירת תיק עבודות דיגיטלי'
    },
    {
      icon: BarChart3,
      title: 'דוחות ואנליטיקה',
      description: 'מעקב אחר הכנסות, הוצאות ותובנות עסקיות חכמות'
    },
    {
      icon: Smartphone,
      title: 'ממשק נייד',
      description: 'גישה מלאה מכל מכשיר - מחשב, טאבלט או סמארטפון'
    },
    {
      icon: Star,
      title: 'ניהול שיווק',
      description: 'כלי שיווק מתקדמים ורשתות חברתיות למקסום החשיפה'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" dir="rtl">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            GlowDesk
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-light">
            המערכת השלמה לניהול סלון יופי
          </p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            פתרון דיגיטלי מתקדם לניהול כל היבטי העסק שלך - מתורים ועד דוחות כספיים
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              התחל עכשיו - חינם
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-4 text-lg rounded-xl"
              onClick={() => navigate('/login')}
            >
              כניסה למערכת
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
              <feature.icon className="h-12 w-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/50">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            מוכנים לשדרג את העסק שלכם?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            הצטרפו לאלפי בעלי עסקים שכבר משתמשים ב-GlowDesk לניהול מקצועי ויעיל של הסלון
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-12 py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/register')}
          >
            יאללה, בואו נתחיל!
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 GlowDesk. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
