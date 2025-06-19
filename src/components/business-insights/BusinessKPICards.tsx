
import { Card, CardContent } from '@/components/ui/card';
import { BusinessKPI } from '@/services/businessInsightsService';
import { Banknote, Users, TrendingUp, UserX, Repeat, Clock, Calendar } from 'lucide-react';

interface BusinessKPICardsProps {
  kpis: BusinessKPI;
  timeFrame: 'daily' | 'weekly' | 'monthly';
}

const BusinessKPICards = ({ kpis, timeFrame }: BusinessKPICardsProps) => {
  const formatCurrency = (amount: number) => `₪${amount.toLocaleString()}`;
  const formatPercentage = (rate: number) => `${rate.toFixed(1)}%`;

  const getTimeFrameText = () => {
    switch (timeFrame) {
      case 'daily': return 'היום';
      case 'weekly': return 'השבוע';
      case 'monthly': return 'החודש';
    }
  };

  const cards = [
    {
      title: `סך ההכנסות ${getTimeFrameText()}`,
      value: formatCurrency(kpis.totalRevenue),
      icon: <Banknote className="h-5 w-5" style={{ color: '#9C6B50' }} />,
      bgColor: 'bg-gradient-to-br from-[#FDF4EF] to-[#F6BE9A]/20'
    },
    {
      title: `מספר לקוחות ${getTimeFrameText()}`,
      value: kpis.totalClients.toString(),
      icon: <Users className="h-5 w-5" style={{ color: '#69493F' }} />,
      bgColor: 'bg-gradient-to-br from-[#F6BE9A]/30 to-[#9C6B50]/10'
    },
    {
      title: 'ממוצע הכנסה ללקוחה',
      value: formatCurrency(kpis.averagePerClient),
      icon: <TrendingUp className="h-5 w-5" style={{ color: '#3A1E14' }} />,
      bgColor: 'bg-gradient-to-br from-[#9C6B50]/20 to-[#69493F]/10'
    },
    {
      title: 'שיעור ביטולים',
      value: formatPercentage(kpis.cancellationRate),
      icon: <UserX className="h-5 w-5" style={{ color: '#F6BE9A' }} />,
      bgColor: 'bg-gradient-to-br from-[#69493F]/15 to-[#3A1E14]/5'
    },
    {
      title: 'לקוחות חוזרים',
      value: kpis.repeatBookings.toString(),
      icon: <Repeat className="h-5 w-5" style={{ color: '#9C6B50' }} />,
      bgColor: 'bg-gradient-to-br from-[#FDF4EF] to-[#F6BE9A]/15'
    },
    {
      title: timeFrame === 'daily' ? 'שעת שיא' : 'יום שיא',
      value: timeFrame === 'daily' ? kpis.peakHour : kpis.peakDay,
      icon: timeFrame === 'daily' ? 
        <Clock className="h-5 w-5" style={{ color: '#69493F' }} /> :
        <Calendar className="h-5 w-5" style={{ color: '#69493F' }} />,
      bgColor: 'bg-gradient-to-br from-[#F6BE9A]/25 to-[#9C6B50]/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.bgColor} border-none shadow-soft hover:shadow-md transition-all duration-300`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground text-right">{card.title}</p>
                <p className="text-2xl font-bold text-right" style={{ color: '#3A1E14' }}>{card.value}</p>
              </div>
              <div className="flex-shrink-0">
                {card.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BusinessKPICards;
