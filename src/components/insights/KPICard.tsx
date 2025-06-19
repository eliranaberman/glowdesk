
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  className?: string;
}

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: KPICardProps) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000) {
        return `₪${val.toLocaleString()}`;
      }
      return val.toString();
    }
    return val;
  };

  const getTrendColor = (trendValue: number) => {
    if (trendValue > 0) return 'text-green-600';
    if (trendValue < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'border-r-4 border-r-[#9C6B50] bg-gradient-to-br from-[#FDF4EF] to-white';
      case 'secondary':
        return 'border-r-4 border-r-[#F6BE9A] bg-gradient-to-br from-[#FDF4EF]/50 to-white';
      case 'accent':
        return 'border-r-4 border-r-[#69493F] bg-gradient-to-br from-[#FDF4EF]/70 to-white';
      default:
        return 'border-r-4 border-r-gray-300 bg-gradient-to-br from-gray-50 to-white';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      getVariantStyles(),
      className
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold text-[#3A1E14]">
                {formatValue(value)}
              </p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-sm font-medium",
                getTrendColor(trend.value)
              )}>
                <span>
                  {trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">
                  {trend.label}
                </span>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-[#9C6B50]/10 flex items-center justify-center">
              <Icon className="h-6 w-6 text-[#9C6B50]" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
