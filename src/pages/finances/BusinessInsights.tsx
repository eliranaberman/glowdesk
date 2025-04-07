
import { BarChart, Calendar, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import BusinessInsights from '@/components/dashboard/BusinessInsights';

const BusinessInsightsPage = () => {
  const [activeRange, setActiveRange] = useState('week');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">תובנות עסקיות</h1>
          <p className="text-muted-foreground">מדדי ביצוע והמלצות להתייעלות העסק שלך</p>
        </div>
        
        <div className="flex gap-2">
          {/* Date range buttons in RTL order */}
          <div className="filter-button-group">
            <Button 
              variant={activeRange === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('day')}
              className={cn("filter-button", activeRange === 'day' && "filter-button-active")}
            >
              יום
            </Button>
            <Button 
              variant={activeRange === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('week')}
              className={cn("filter-button", activeRange === 'week' && "filter-button-active")}
            >
              שבוע
            </Button>
            <Button 
              variant={activeRange === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('month')}
              className={cn("filter-button", activeRange === 'month' && "filter-button-active")}
            >
              חודש
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">לקוחות מרוצים</CardTitle>
              <Users className="h-5 w-5 text-roseGold/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">86%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+2%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">לקוחות חוזרים</CardTitle>
              <Users className="h-5 w-5 text-roseGold/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+5%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">גידול בהכנסות</CardTitle>
              <TrendingUp className="h-5 w-5 text-oliveGreen/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+3%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">ביצועי פרסום</CardTitle>
              <BarChart className="h-5 w-5 text-deepNavy/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-rose-500">-2%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Business Insights Component */}
        <BusinessInsights />

        {/* Additional components would go here */}
      </div>
    </div>
  );
};

export default BusinessInsightsPage;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
