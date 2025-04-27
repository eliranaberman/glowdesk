
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, change, className }: StatCardProps) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg", 
        className
      )}
    >
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-2 transition-all duration-300 hover:text-primary">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-1 animate-fade-in">
                <span 
                  className={cn(
                    "text-xs font-medium transition-colors duration-200",
                    change.positive ? "text-oliveGreen" : "text-destructive"
                  )}
                >
                  {change.positive ? '+' : ''}{change.value}
                </span>
                <span className="text-xs text-muted-foreground mr-1">לעומת חודש שעבר</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="p-2 bg-softRose/10 rounded-full transform transition-all duration-300 hover:scale-110 hover:bg-softRose/20">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
