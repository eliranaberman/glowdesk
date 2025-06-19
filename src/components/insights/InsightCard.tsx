
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { SmartInsight } from '@/services/businessInsightsEngine';

interface InsightCardProps {
  insight: SmartInsight;
}

const InsightCard = ({ insight }: InsightCardProps) => {
  const getPriorityStyles = () => {
    switch (insight.priority) {
      case 'high':
        return 'border-r-4 border-r-red-400 bg-red-50/30';
      case 'medium':
        return 'border-r-4 border-r-amber-400 bg-amber-50/30';
      default:
        return 'border-r-4 border-r-blue-400 bg-blue-50/30';
    }
  };

  const getTypeColor = () => {
    switch (insight.type) {
      case 'opportunity':
        return 'text-green-600';
      case 'alert':
        return 'text-red-600';
      case 'trend':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      getPriorityStyles()
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="text-2xl mt-0.5 flex-shrink-0">
            {insight.icon}
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.priority === 'high' && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                <span className={cn("text-xs font-medium", getTypeColor())}>
                  {insight.type === 'opportunity' && 'הזדמנות'}
                  {insight.type === 'alert' && 'התראה'}
                  {insight.type === 'trend' && 'מגמה'}
                  {insight.type === 'suggestion' && 'המלצה'}
                </span>
              </div>
            </div>
            <h3 className="font-semibold text-[#3A1E14] mb-2">
              {insight.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
