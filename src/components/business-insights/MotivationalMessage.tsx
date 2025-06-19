
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface MotivationalMessageProps {
  message: string;
}

const MotivationalMessage = ({ message }: MotivationalMessageProps) => {
  return (
    <Card className="bg-gradient-to-r from-[#9C6B50] to-[#69493F] border-none shadow-lg mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3" dir="rtl">
          <Sparkles className="h-6 w-6 text-[#FDF4EF] flex-shrink-0" />
          <p className="text-[#FDF4EF] font-medium text-lg text-right">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessage;
