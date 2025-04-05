
import { useState } from 'react';
import GanttChart from '../components/scheduling/GanttChart';

const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock appointments data
  const appointments = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      service: 'Gel Manicure',
      startTime: '10:00',
      duration: 60,
      color: 'rgba(198, 113, 211, 0.3)', // Light purple
    },
    {
      id: '2',
      customer: 'Emily Davis',
      service: 'Full Set Acrylic',
      startTime: '12:30',
      duration: 90,
      color: 'rgba(181, 75, 194, 0.3)', // Medium purple
    },
    {
      id: '3',
      customer: 'Lisa Wong',
      service: 'Pedicure',
      startTime: '14:00',
      duration: 75,
      color: 'rgba(156, 61, 167, 0.3)', // Dark purple
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Scheduling</h1>
      <p className="text-muted-foreground mb-6">
        Manage your appointments and schedule your day efficiently.
      </p>

      <GanttChart
        appointments={appointments}
        date={selectedDate}
        onDateChange={setSelectedDate}
      />
    </div>
  );
};

export default Scheduling;
