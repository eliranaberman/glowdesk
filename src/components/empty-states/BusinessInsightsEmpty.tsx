
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const BusinessInsightsEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-8 pb-6 text-center">
          <div className="mb-6">
            <div className="bg-[#FDF4EF] p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <BarChart3 className="h-10 w-10 text-[#9C6B50]" />
            </div>
          </div>
          
          <h2 className="text-xl font-semibold mb-3 text-[#3A1E14]">
            ברוכה הבאה לעמוד התובנות העסקיות!
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            כרגע מוצגים נתוני דמו. התחילי להזין נתונים אמיתיים כדי לראות תובנות מדהימות על העסק שלך!
          </p>
          
          <div className="space-y-3">
            <Link to="/scheduling/new" className="block">
              <Button className="w-full bg-[#9C6B50] hover:bg-[#69493F]">
                <Calendar className="h-4 w-4 mr-2" />
                קבעי תור ראשון
              </Button>
            </Link>
            
            <Link to="/finances/cash-flow" className="block">
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                הוסיפי הכנסה
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-amber-800">
              💡 <strong>טיפ:</strong> ככל שתוסיפי יותר נתונים, התובנות יהיו מדויקות יותר ומועילות יותר לעסק שלך
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessInsightsEmpty;
