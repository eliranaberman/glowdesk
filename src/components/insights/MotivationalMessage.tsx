
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MotivationalMessageProps {
  message: string;
  className?: string;
}

const MotivationalMessage = ({ message, className }: MotivationalMessageProps) => {
  return (
    <Card className={cn(
      "border-r-4 border-r-amber-400 bg-gradient-to-br from-amber-50 to-white",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 flex-row-reverse">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="text-[#3A1E14] font-medium leading-relaxed">
              {message}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessage;
