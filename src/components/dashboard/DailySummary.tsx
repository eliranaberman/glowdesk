
import { CalendarCheck, Clock, DollarSign, PackageOpen } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface DailySummaryProps {
  date?: Date;
  customers: number;
  hours: number;
  revenue: number;
  deficiencies: string[];
}

const DailySummary = ({
  date = new Date(),
  customers,
  hours,
  revenue,
  deficiencies,
}: DailySummaryProps) => {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <CalendarCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Customers</p>
              <p className="text-xl font-bold">{customers}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours</p>
              <p className="text-xl font-bold">{hours}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-xl font-bold">${revenue}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <PackageOpen className="h-5 w-5 text-primary" />
            <h4 className="font-medium">Deficiencies & Restocks</h4>
          </div>
          {deficiencies.length > 0 ? (
            <ul className="space-y-1">
              {deficiencies.map((item, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-nail-400"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No deficiencies reported today.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummary;
