
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Check,
  X,
  CalendarDays,
  User,
  Scissors
} from 'lucide-react';
import { format, parseISO, isToday, addDays, isTomorrow } from 'date-fns';
import { he } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Appointment {
  id: string;
  customer_name: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  status: string;
}

const Scheduling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock appointment data
      const mockData: Appointment[] = [
        {
          id: '1',
          customer_name: 'שרה כהן',
          service: 'מניקור ג\'ל',
          date: '2025-04-10',
          time: '10:00',
          duration: '60',
          status: 'scheduled'
        },
        {
          id: '2',
          customer_name: 'אמילי לוי',
          service: 'אקריליק מלא',
          date: '2025-04-10',
          time: '12:30',
          duration: '90',
          status: 'scheduled'
        },
        {
          id: '3',
          customer_name: 'ליאת ונג',
          service: 'פדיקור',
          date: '2025-04-10',
          time: '14:00',
          duration: '75',
          status: 'cancelled'
        },
        {
          id: '4',
          customer_name: 'מיכל אברהם',
          service: 'לק ג\'ל',
          date: '2025-04-11',
          time: '11:00',
          duration: '45',
          status: 'scheduled'
        },
        {
          id: '5',
          customer_name: 'רחל גולן',
          service: 'בניית ציפורניים',
          date: '2025-04-11',
          time: '13:00',
          duration: '120',
          status: 'scheduled'
        },
      ];
      
      setAppointments(mockData);
      setLoading(false);
    };
    
    fetchAppointments();
  }, []);

  // Filter appointments based on search query and active tab
  const filteredAppointments = appointments.filter(appointment => {
    // Filter by search query
    const matchesSearch = 
      appointment.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    const matchesTab = 
      (activeTab === 'upcoming' && appointment.status === 'scheduled') ||
      (activeTab === 'completed' && appointment.status === 'completed') ||
      (activeTab === 'cancelled' && appointment.status === 'cancelled') ||
      activeTab === 'all';
    
    return matchesSearch && matchesTab;
  });

  // Group appointments by date
  const appointmentsByDate = filteredAppointments.reduce<{ [key: string]: Appointment[] }>((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(appointmentsByDate).sort();

  // Format date display
  const formatDateDisplay = (dateString: string) => {
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return 'היום';
    } else if (isTomorrow(date)) {
      return 'מחר';
    } else {
      return format(date, 'EEEE, d בMMMM', { locale: he });
    }
  };

  // Handle appointment status display
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">מתוכנן</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">הושלם</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">בוטל</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6" dir="rtl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-2 sm:space-y-0">
        <h1 className="text-2xl font-bold">לוח פגישות</h1>
        <div className="flex space-x-2 space-x-reverse">
          <Button 
            variant="outline"
            onClick={() => navigate('/calendar')}
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            צפייה בלוח שנה
          </Button>
          <Button 
            onClick={() => navigate('/scheduling/new')}
          >
            <Plus className="mr-2 h-4 w-4" />
            פגישה חדשה
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="חיפוש לפי שם לקוח או סוג שירות..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 pr-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">פגישות מתוכננות</TabsTrigger>
          <TabsTrigger value="completed">פגישות שהושלמו</TabsTrigger>
          <TabsTrigger value="cancelled">פגישות שבוטלו</TabsTrigger>
          <TabsTrigger value="all">כל הפגישות</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </CardContent>
            </Card>
          ) : filteredAppointments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center text-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-2">אין פגישות להצגה</h3>
                <p className="text-muted-foreground mb-4">
                  {activeTab === 'upcoming' ? 'אין פגישות מתוכננות בקרוב' :
                   activeTab === 'completed' ? 'אין פגישות שהושלמו להצגה' :
                   activeTab === 'cancelled' ? 'אין פגישות שבוטלו להצגה' :
                   'אין פגישות להצגה כרגע'}
                </p>
                <Button onClick={() => navigate('/scheduling/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  צור פגישה חדשה
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedDates.map(date => (
              <div key={date}>
                <h2 className="text-md font-semibold mb-2 flex items-center">
                  <CalendarIcon className="w-4 h-4 inline-block ml-2" />
                  {formatDateDisplay(date)}
                </h2>
                
                <Card className="mb-6">
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {appointmentsByDate[date]
                        .sort((a, b) => a.time.localeCompare(b.time))
                        .map(appointment => (
                          <div 
                            key={appointment.id} 
                            className={cn(
                              "p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                              appointment.status === 'cancelled' && "bg-muted/20"
                            )}
                            onClick={() => navigate(`/scheduling/${appointment.id}`)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={cn(
                                  "w-10 h-10 rounded-full flex items-center justify-center ml-3",
                                  appointment.status === 'scheduled' ? "bg-blue-100 text-blue-700" :
                                  appointment.status === 'completed' ? "bg-green-100 text-green-700" :
                                  "bg-red-100 text-red-700"
                                )}>
                                  {appointment.status === 'scheduled' && <Clock className="h-5 w-5" />}
                                  {appointment.status === 'completed' && <Check className="h-5 w-5" />}
                                  {appointment.status === 'cancelled' && <X className="h-5 w-5" />}
                                </div>
                                <div>
                                  <div className="font-medium">{appointment.time} - {appointment.customer_name}</div>
                                  <div className="flex items-center text-sm text-muted-foreground space-x-4 space-x-reverse">
                                    <span className="flex items-center">
                                      <Scissors className="h-3 w-3 mr-1" />
                                      {appointment.service}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {appointment.duration} דקות
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center">
                                {getStatusBadge(appointment.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Scheduling;
