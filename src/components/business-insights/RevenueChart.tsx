
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '@/services/businessInsightsService';

interface RevenueChartProps {
  data: TimeSeriesData[];
  timeFrame: 'daily' | 'weekly' | 'monthly';
}

const RevenueChart = ({ data, timeFrame }: RevenueChartProps) => {
  const getTitle = () => {
    switch (timeFrame) {
      case 'daily': return 'מגמת הכנסות - 7 ימים אחרונים';
      case 'weekly': return 'מגמת הכנסות - 4 שבועות אחרונים';
      case 'monthly': return 'מגמת הכנסות - 6 חודשים אחרונים';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg" dir="rtl">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'revenue' && `הכנסות: ₪${entry.value.toLocaleString()}`}
              {entry.name === 'appointments' && `פגישות: ${entry.value}`}
              {entry.name === 'clients' && `לקוחות: ${entry.value}`}
            </p>
          ))}
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
            {getTitle()}
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
          {getTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            {timeFrame === 'daily' ? (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F6BE9A" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#69493F"
                  fontSize={12}
                />
                <YAxis stroke="#69493F" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#9C6B50" 
                  strokeWidth={3}
                  dot={{ fill: '#9C6B50', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#69493F' }}
                  name="revenue"
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F6BE9A" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#69493F"
                  fontSize={12}
                />
                <YAxis stroke="#69493F" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="#9C6B50"
                  radius={[4, 4, 0, 0]}
                  name="revenue"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
