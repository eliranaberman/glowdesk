
import { CalendarClock, Users, DollarSign, TrendingUp } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DailySummary from '../components/dashboard/DailySummary';
import RecentAppointments from '../components/dashboard/RecentAppointments';

const Dashboard = () => {
  // Dummy data
  const stats = [
    { title: 'Total Customers', value: '127', icon: <Users className="h-5 w-5 text-primary" />, change: { value: '12%', positive: true } },
    { title: 'Monthly Appointments', value: '89', icon: <CalendarClock className="h-5 w-5 text-primary" />, change: { value: '5%', positive: true } },
    { title: 'Monthly Revenue', value: '$3,248', icon: <DollarSign className="h-5 w-5 text-primary" />, change: { value: '8%', positive: true } },
    { title: 'Avg. Service Value', value: '$42', icon: <TrendingUp className="h-5 w-5 text-primary" />, change: { value: '3%', positive: false } },
  ];
  
  const appointments = [
    { id: '1', customer: 'Sarah Johnson', service: 'Gel Manicure', time: 'Today, 10:00 AM', price: 35, status: 'upcoming' as const },
    { id: '2', customer: 'Emily Davis', service: 'Full Set Acrylic', time: 'Today, 12:30 PM', price: 65, status: 'upcoming' as const },
    { id: '3', customer: 'Lisa Wong', service: 'Pedicure', time: 'Today, 2:00 PM', price: 45, status: 'upcoming' as const },
    { id: '4', customer: 'Maria Garcia', service: 'Nail Art', time: 'Yesterday, 11:00 AM', price: 55, status: 'completed' as const },
    { id: '5', customer: 'Jennifer Miller', service: 'Manicure', time: 'Yesterday, 3:30 PM', price: 30, status: 'cancelled' as const },
  ];
  
  const dailyData = {
    customers: 8,
    hours: 7.5,
    revenue: 320,
    deficiencies: [
      'Acetone - 1 bottle left',
      'White polish - running low',
      'UV lamp needs cleaning',
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySummary 
          customers={dailyData.customers}
          hours={dailyData.hours}
          revenue={dailyData.revenue}
          deficiencies={dailyData.deficiencies}
        />
        <RecentAppointments appointments={appointments} />
      </div>
      
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">New Appointment</h3>
            <p className="text-sm text-muted-foreground">Schedule a new client</p>
          </div>
          <div className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">Add Customer</h3>
            <p className="text-sm text-muted-foreground">Create a new customer profile</p>
          </div>
          <div className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">Record Payment</h3>
            <p className="text-sm text-muted-foreground">Log a new transaction</p>
          </div>
          <div className="bg-secondary hover:bg-secondary/80 p-4 rounded-lg cursor-pointer transition-colors">
            <h3 className="font-medium">Update Inventory</h3>
            <p className="text-sm text-muted-foreground">Log new products or deficiencies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
