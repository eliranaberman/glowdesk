
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
        "overflow-hidden transform transition-all duration-500 cursor-pointer group relative", 
        "hover:-translate-y-2 hover:shadow-hover hover:shadow-roseGold/20",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-warmBeige/50 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        onClick && "cursor-pointer",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="relative">
            <p className="text-sm font-medium text-muted-foreground mb-1 transition-colors duration-300 group-hover:text-deepNavy/80">
              {title}
            </p>
            <h3 className="text-2xl font-bold mt-2 transition-all duration-300 group-hover:text-primary group-hover:scale-105 origin-left">
              {value}
            </h3>
            
            {change && (
              <div className="flex items-center mt-2 animate-fade-in">
                <div className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-300",
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
                <span className="text-xs text-muted-foreground mr-2 transition-colors duration-300 group-hover:text-deepNavy/60">
                  לעומת חודש שעבר
                </span>
              </div>
            )}

            {description && (
              <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {description}
              </p>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "p-3 rounded-full transition-all duration-500 transform",
              "bg-gradient-to-br from-softRose/20 to-roseGold/20",
              "group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg",
              "group-hover:from-softRose/30 group-hover:to-roseGold/30"
            )}>
              <div className="transition-all duration-300 group-hover:scale-110">
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
