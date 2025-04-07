
import { BarChart, Calendar, DollarSign, TrendingUp, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CashFlowForecast from '@/components/dashboard/CashFlowForecast';
import { useState } from 'react';

const CashFlow = () => {
  const [activeRange, setActiveRange] = useState('week');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">תזרים מזומנים</h1>
          <p className="text-muted-foreground">צפייה וניהול תזרים המזומנים של העסק</p>
        </div>
        
        <div className="flex gap-2">
          {/* Date range buttons in RTL order - Day on right, Month on left */}
          <div className="filter-button-group flex">
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
              <CardTitle className="text-sm font-medium">סך הכנסות</CardTitle>
              <DollarSign className="h-5 w-5 text-oliveGreen/80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪15,425</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+4%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">סך הוצאות</CardTitle>
              <Receipt className="h-5 w-5 text-softRose/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪8,250</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-rose-500">+2%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">רווח נקי</CardTitle>
              <TrendingUp className="h-5 w-5 text-roseGold/90" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪7,175</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+7%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card className="elegant-card">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">תחזית חודשית</CardTitle>
              <Calendar className="h-5 w-5 text-deepNavy/60" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪16,800</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center">
                <span className="inline-block mr-1 text-oliveGreen">+9%</span> צפי לחודש הבא
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow Forecast Component */}
        <CashFlowForecast />

        {/* Additional components would go here */}
      </div>
    </div>
  );
};

export default CashFlow;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
