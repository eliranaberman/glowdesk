
import { BarChart, Calendar, DollarSign, TrendingUp } from 'lucide-react';
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
          {/* Date range buttons in RTL order */}
          <div className="bg-muted p-1 rounded-lg flex">
            <Button 
              variant={activeRange === 'day' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('day')}
              className="rounded-lg"
            >
              יום
            </Button>
            <Button 
              variant={activeRange === 'week' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('week')}
              className="rounded-lg"
            >
              שבוע
            </Button>
            <Button 
              variant={activeRange === 'month' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveRange('month')}
              className="rounded-lg"
            >
              חודש
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">סך הכנסות</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪15,425</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+4%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">סך הוצאות</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪8,250</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-rose-500">+2%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">רווח נקי</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪7,175</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+7%</span> מהחודש הקודם
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">תחזית חודשית</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₪16,800</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-500">+9%</span> צפי לחודש הבא
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

function Receipt(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l5-3 5 3 5-3 5 3V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
    </svg>
  );
}
