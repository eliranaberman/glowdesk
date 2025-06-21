
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
  onClick?: () => void;
  description?: string;
}

const StatCard = ({ title, value, icon, change, className, onClick, description }: StatCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={cn(
        "overflow-hidden transform transition-all duration-500 cursor-pointer group relative h-[120px]", 
        "hover:-translate-y-1 hover:shadow-hover hover:shadow-roseGold/20",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-warmBeige/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        onClick && "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className="p-4 h-full relative z-10">
        <div className="flex items-start justify-between h-full">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-deepNavy/80 truncate text-center">
              {title}
            </p>
            <h3 className="text-xl font-bold mb-2 transition-all duration-300 group-hover:text-primary group-hover:scale-105 origin-center text-center">
              {value}
            </h3>
            
            {change && (
              <div className="flex items-center justify-center animate-fade-in">
                <div className={cn(
                  "flex items-center justify-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300",
                  change.positive 
                    ? "text-oliveGreen bg-oliveGreen/10 group-hover:bg-oliveGreen/20" 
                    : "text-destructive bg-destructive/10 group-hover:bg-destructive/20"
                )}>
                  <span className={cn("transition-transform duration-300", 
                    isHovered && (change.positive ? "animate-bounce" : "animate-pulse")
                  )}>
                    {change.positive ? '↗' : '↘'}
                  </span>
                  <span>{change.value}</span>
                </div>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "p-2 rounded-full transition-all duration-500 transform flex-shrink-0",
              "bg-gradient-to-br from-softRose/20 to-roseGold/20",
              "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg",
              "group-hover:from-softRose/30 group-hover:to-roseGold/30",
              "flex items-center justify-center"
            )}>
              <div className="transition-all duration-300 group-hover:scale-110 flex items-center justify-center">
                {icon}
              </div>
            </div>
          )}
        </div>

        {/* Subtle shine effect on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
          "transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"
        )} />
      </CardContent>
    </Card>
  );
};

export default StatCard;
