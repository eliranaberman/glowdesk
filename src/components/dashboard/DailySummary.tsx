
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Clock, CreditCard, AlertCircle } from 'lucide-react';

interface DailySummaryProps {
  customers: number;
  hours: number;
  revenue: number;
  deficiencies: string[];
}

const DailySummary = ({ customers, hours, revenue, deficiencies }: DailySummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>סיכום יומי</CardTitle>
        <CardDescription>מבט סיכום על הפעילות היומית</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <Users className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-xl font-semibold">{customers}</span>
            <span className="text-xs text-muted-foreground">לקוחות</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <Clock className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-xl font-semibold">{hours}</span>
            <span className="text-xs text-muted-foreground">שעות</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-secondary/50 rounded-lg">
            <CreditCard className="h-5 w-5 text-muted-foreground mb-2" />
            <span className="text-xl font-semibold">₪{revenue}</span>
            <span className="text-xs text-muted-foreground">הכנסה</span>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
            <h3 className="text-sm font-medium">חוסרים וצרכים דחופים</h3>
          </div>
          <ul className="space-y-1 text-sm">
            {deficiencies.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
