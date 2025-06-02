
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import ReportGenerator from '@/components/reports/ReportGenerator';

const FinancialReports = () => {
  const location = useLocation();
  const [openGenerator, setOpenGenerator] = useState(false);
  
  useEffect(() => {
    // Check if we're coming from the insights page with the openGenerator flag
    if (location.state && location.state.openGenerator) {
      setOpenGenerator(true);
    }
  }, [location]);

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center flex items-center justify-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold mb-1 text-right">דוחות פיננסיים</h1>
          <p className="text-muted-foreground text-right">יצירה וניהול דוחות פיננסיים עבור העסק שלך</p>
        </div>
        <BarChart className="w-12 h-12 text-primary" />
      </div>
      
      <div className="grid gap-6 w-full max-w-4xl">
        <Card>
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <span>יצירת דוח מותאם אישית</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReportGenerator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReports;
