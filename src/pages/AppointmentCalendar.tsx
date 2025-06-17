
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { Plus, Search } from 'lucide-react';
import GanttChart from '@/components/scheduling/GanttChart';
import AppointmentForm from '@/components/scheduling/AppointmentForm';
import { 
  getEmployees, 
  getUniqueServiceTypes, 
  getAppointments,
  generateMockAppointments
} from '@/services/appointmentService';
import { useIsMobile } from '@/hooks/use-mobile';

const AppointmentCalendar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersVisible, setIsFiltersVisible] = useState(!isMobile);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
        const serviceTypesData = await getUniqueServiceTypes();
        setServiceTypes(serviceTypesData);
        
        await loadAppointments();
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('שגיאה בטעינת הנתונים');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate, selectedEmployeeId, selectedServiceType, selectedStatus, searchQuery]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const appointmentsData = await getAppointments({
        employee_id: selectedEmployeeId,
        service_type: selectedServiceType,
        status: selectedStatus === 'all' ? 'all' : selectedStatus as any,
        search: searchQuery,
        date_from: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
        date_to: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0),
      });

      const formattedAppointments = appointmentsData.map(appointment => {
        let color;
        switch (appointment.status) {
          case 'scheduled':
            color = '#E5DEFF';
            break;
          case 'completed':
            color = '#F2FCE2';
            break;
          case 'cancelled':
            color = '#FFDEE2';
            break;
          default:
            color = '#D3E4FD';
        }

        return {
          id: appointment.id,
          customer: appointment.client?.full_name || 'לקוח לא ידוע',
          service: appointment.service_type,
          startTime: appointment.start_time,
          duration: calculateDuration(appointment.start_time, appointment.end_time),
          date: new Date(appointment.date),
          color,
          price: '₪120',
          status: appointment.status,
          employeeId: appointment.employee_id,
        };
      });

      setAppointments(formattedAppointments);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('שגיאה בטעינת הפגישות');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;
    
    return endTotalMinutes - startTotalMinutes;
  };

  const handleGenerateMockData = async () => {
    try {
      await generateMockAppointments();
      toast.success('נוצרו 30 פגישות לדוגמה');
      await loadAppointments();
    } catch (error) {
      console.error('Error generating mock data:', error);
      toast.error('שגיאה ביצירת נתוני דוגמה');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedEmployeeId(null);
    setSelectedServiceType(null);
    setSelectedStatus('all');
  };

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return (
    <div>
      <Helmet>
        <title>יומן פגישות | Chen Mizrahi</title>
      </Helmet>

      <div className={`flex justify-between items-center ${isMobile ? 'mb-4' : 'mb-6'}`}>
        <div>
          <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} mb-1`}>יומן פגישות</h1>
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
            ניהול ותזמון הפגישות שלך
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isMobile ? null : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateMockData}
            >
              צור נתוני דוגמה
            </Button>
          )}
          <Button 
            onClick={() => setIsNewAppointmentOpen(true)}
            className={`flex items-center gap-2 ${isMobile ? 'h-8 text-xs' : ''}`}
          >
            <Plus className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
            {isMobile ? 'חדש' : 'פגישה חדשה'}
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="appointments"
        value={activeTab}
        onValueChange={setActiveTab}
        className={isMobile ? "mb-4" : "mb-6"}
        dir="rtl"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="appointments">פגישות</TabsTrigger>
          <TabsTrigger value="calendar">לוח שנה</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardContent className={isMobile ? "p-3" : "p-6"}>
              <div className={`flex ${isMobile ? 'flex-col gap-2 mb-2' : 'flex-col md:flex-row gap-4 mb-4'}`}>
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 ${isMobile ? 'top-2 h-3 w-3' : 'top-3 h-4 w-4'} text-muted-foreground`} />
                  <Input
                    placeholder="חפש לפי שם לקוח..."
                    className={`pl-10 ${isMobile ? 'h-8 text-sm' : ''}`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {isMobile ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleFilters}
                    className="text-xs"
                  >
                    {isFiltersVisible ? 'הסתר סינון' : 'הצג סינון'}
                  </Button>
                ) : null}
                
                {isFiltersVisible && (
                  <div className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center gap-4 flex-wrap'}`}>
                    <div className={isMobile ? "w-full" : "min-w-36"}>
                      <Select
                        value={selectedEmployeeId || ''}
                        onValueChange={(value) => setSelectedEmployeeId(value || null)}
                      >
                        <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                          <SelectValue placeholder="כל העובדים" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">כל העובדים</SelectItem>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className={isMobile ? "w-full" : "min-w-36"}>
                      <Select
                        value={selectedServiceType || ''}
                        onValueChange={(value) => setSelectedServiceType(value || null)}
                      >
                        <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                          <SelectValue placeholder="כל השירותים" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">כל השירותים</SelectItem>
                          {serviceTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className={isMobile ? "w-full" : "min-w-36"}>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className={isMobile ? "h-8 text-sm" : ""}>
                          <SelectValue placeholder="כל הסטטוסים" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">כל הסטטוסים</SelectItem>
                          <SelectItem value="scheduled">מתוכנן</SelectItem>
                          <SelectItem value="completed">הושלם</SelectItem>
                          <SelectItem value="cancelled">בוטל</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleResetFilters}
                      className={isMobile ? "text-xs" : ""}
                    >
                      אפס סינון
                    </Button>
                  </div>
                )}
              </div>
              
              <GanttChart 
                appointments={appointments}
                date={selectedDate}
                onDateChange={setSelectedDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardContent className={isMobile ? "p-3" : "p-6"}>
              <div className={`text-center ${isMobile ? 'p-8' : 'p-16'}`}>
                <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>תצוגת לוח שנה מורחבת</h3>
                <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-xs' : ''}`}>
                  תצוגה זו תהיה זמינה בגרסה הבאה. כרגע ניתן להשתמש בתצוגת הפגישות.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab('appointments')}
                  className={`mt-4 ${isMobile ? 'text-xs' : ''}`}
                >
                  חזור לתצוגת פגישות
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className={isMobile ? "max-w-[320px]" : "max-w-md"}>
          <DialogHeader>
            <DialogTitle className={isMobile ? "text-lg" : ""}>פגישה חדשה</DialogTitle>
            <DialogDescription className={isMobile ? "text-xs" : ""}>צור פגישה חדשה ביומן</DialogDescription>
          </DialogHeader>
          <AppointmentForm 
            onSuccess={() => {
              setIsNewAppointmentOpen(false);
              loadAppointments();
            }}
            onCancel={() => setIsNewAppointmentOpen(false)}
            initialDate={selectedDate}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentCalendar;
