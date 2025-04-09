
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">דוחות פיננסיים</h1>
        <p className="text-muted-foreground">יצירה וניהול דוחות פיננסיים עבור העסק שלך</p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">יצירת דוח מותאם אישית</CardTitle>
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
