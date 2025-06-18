
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/he';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  getEmployees,
  getUniqueServiceTypes,
  getAppointments,
  generateMockAppointments,
  type Appointment
} from '@/services/appointmentService';

moment.locale('he');
const localizer = momentLocalizer(moment);

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<{id: string, name: string}[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('week');

  useEffect(() => {
    loadAppointments();
    loadEmployeesAndServices();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      
      // Calculate date range based on selection
      const now = new Date();
      let dateFrom: Date, dateTo: Date;
      
      switch (selectedDateRange) {
        case 'today':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
          break;
        case 'week':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
          dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6, 23, 59, 59);
          break;
        case 'month':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), 1);
          dateTo = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
          break;
        default:
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          dateTo = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);
      }

      const filters = {
        date_from: dateFrom,
        date_to: dateTo,
        ...(selectedStatus !== 'all' && { status: selectedStatus })
      };

      const data = await getAppointments(filters);
      setAppointments(data);
      
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בטעינת התורים",
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeesAndServices = async () => {
    try {
      const [employeeData, serviceData] = await Promise.all([
        getEmployees(),
        getUniqueServiceTypes()
      ]);
      setEmployees(employeeData);
      setServiceTypes(serviceData);
    } catch (error: any) {
      console.error('Error loading metadata:', error);
    }
  };

  // Apply filters whenever appointments or filter values change
  useEffect(() => {
    let filtered = [...appointments];
    
    if (selectedService !== 'all') {
      filtered = filtered.filter(apt => apt.service_type === selectedService);
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, selectedService]);

  // Reload appointments when filters change
  useEffect(() => {
    loadAppointments();
  }, [selectedStatus, selectedDateRange]);

  // Transform appointments for calendar display
  const calendarEvents = filteredAppointments.map(appointment => {
    const startTime = moment(`${appointment.date} ${appointment.start_time}`, 'YYYY-MM-DD HH:mm').toDate();
    const endTime = moment(`${appointment.date} ${appointment.end_time}`, 'YYYY-MM-DD HH:mm').toDate();
    
    return {
      id: appointment.id,
      title: `${appointment.service_type}${appointment.client?.full_name ? ` - ${appointment.client.full_name}` : ''}`,
      start: startTime,
      end: endTime,
      resource: appointment,
    };
  });

  const handleSelectEvent = (event: any) => {
    navigate(`/scheduling/appointments/${event.id}/edit`);
  };

  const handleSelectSlot = (slotInfo: any) => {
    navigate('/scheduling/appointments/new');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'completed': return 'success'; 
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">יומן תורים</h1>
          <p className="text-muted-foreground">ניהול ותזמון תורים</p>
        </div>
        
        <Button onClick={() => navigate('/scheduling/appointments/new')}>
          <Plus className="mr-2 h-4 w-4" />
          תור חדש
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            סינון תורים
          </CardTitle>
          <CardDescription>סנן תורים לפי סטטוס, שירות ותאריך</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">סטטוס</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="scheduled">מתוזמן</SelectItem>
                  <SelectItem value="completed">הושלם</SelectItem>
                  <SelectItem value="cancelled">בוטל</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">סוג שירות</label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל השירותים</SelectItem>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">טווח תאריכים</label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">היום</SelectItem>
                  <SelectItem value="week">השבוע</SelectItem>
                  <SelectItem value="month">החודש</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div style={{ height: 600 }} className="p-4">
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                defaultView={Views.WEEK}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor: event.resource.status === 'completed' ? '#22c55e' : 
                                   event.resource.status === 'cancelled' ? '#ef4444' : '#3b82f6',
                  }
                })}
                messages={{
                  next: "הבא",
                  previous: "הקודם", 
                  today: "היום",
                  month: "חודש",
                  week: "שבוע", 
                  day: "יום"
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>סה"כ תורים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAppointments.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>תורים שהושלמו</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {filteredAppointments.filter(apt => apt.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>תורים שבוטלו</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredAppointments.filter(apt => apt.status === 'cancelled').length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
