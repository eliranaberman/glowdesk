
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ServiceDistribution } from '@/services/businessInsightsService';

interface ServiceDistributionChartProps {
  data: ServiceDistribution[];
  timeFrame: 'daily' | 'weekly' | 'monthly';
}

const ServiceDistributionChart = ({ data, timeFrame }: ServiceDistributionChartProps) => {
  const getTimeFrameText = () => {
    switch (timeFrame) {
      case 'daily': return 'היום';
      case 'weekly': return 'השבוע';
      case 'monthly': return 'החודש';
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg" dir="rtl">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} טיפולים ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-[#FDF4EF] to-white border-none shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg text-right" style={{ color: '#3A1E14' }}>
            התפלגות סוגי טיפולים {getTimeFrameText()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            אין נתונים להצגה
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[#FDF4EF] to-white border-none shadow-soft">
      <CardHeader>
        <CardTitle className="text-lg text-right" style={{ color: '#3A1E14' }}>
          התפלגות סוגי טיפולים {getTimeFrameText()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: '#3A1E14' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 space-y-2" dir="rtl">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/50">
              <span className="text-sm font-medium" style={{ color: '#3A1E14' }}>{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{item.value} טיפולים</span>
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceDistributionChart;
