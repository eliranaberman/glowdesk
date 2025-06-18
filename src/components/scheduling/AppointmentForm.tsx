import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Share2, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from 'sonner';
import { 
  AppointmentFormData, 
  createAppointment, 
  updateAppointment, 
  getAppointmentById,
  getEmployees,
  getUniqueServiceTypes,
  syncAppointmentWithCalendar,
  downloadIcsFile
} from '@/services/appointmentService';
import { sendAppointmentNotification } from '@/services/notificationService';
import { Customer, getCustomers } from '@/services/customerService';
import { getUserCalendarConnections } from '@/services/calendarService';

// Extended form schema with notification and calendar options
const appointmentSchema = z.object({
  customer_id: z.string().min(1, { message: 'נא לבחור לקוח' }),
  employee_id: z.string().nullable(),
  service_type: z.string().min(1, { message: 'נא לבחור סוג שירות' }),
  date: z.date({ required_error: 'נא לבחור תאריך' }),
  start_time: z.string().min(1, { message: 'נא להזין שעת התחלה' }),
  end_time: z.string().min(1, { message: 'נא להזין שעת סיום' }),
  status: z.enum(['scheduled', 'cancelled', 'completed'], {
    required_error: 'נא לבחור סטטוס',
  }),
  notes: z.string().nullable(),
  send_confirmation: z.boolean().optional(),
  sync_with_calendar: z.boolean().optional(),
  calendar_id: z.string().optional(),
});

type AppointmentFormSchema = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  appointmentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialDate?: Date;
  initialTime?: string;
}

const AppointmentForm = ({ 
  appointmentId, 
  onSuccess, 
  onCancel,
  initialDate,
  initialTime
}: AppointmentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [calendarConnections, setCalendarConnections] = useState<any[]>([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // Default form values
  const defaultValues: AppointmentFormSchema = {
    customer_id: '',
    employee_id: null,
    service_type: '',
    date: initialDate || new Date(),
    start_time: initialTime || '09:00',
    end_time: initialTime ? calculateEndTime(initialTime, 60) : '10:00',
    status: 'scheduled' as const,
    notes: null,
    send_confirmation: true,
    sync_with_calendar: true,
    calendar_id: '',
  };
  
  const form = useForm<AppointmentFormSchema>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });
  
  // Helper function to calculate end time based on start time and duration
  function calculateEndTime(startTime: string, durationMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
  }

  // Load customers, employees, service types, and calendar connections data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch customers for dropdown
        const customersData = await getCustomers({
          search: '',
          status: 'all',
          loyalty_level: 'all',
          tags: [],
          sort_by: 'full_name',
          sort_direction: 'asc'
        });
        setCustomers(customersData);
        
        // Fetch employees for dropdown
        const employeesData = await getEmployees();
        setEmployees(employeesData);
        
        // Fetch service types for dropdown
        const serviceTypesData = await getUniqueServiceTypes();
        setServiceTypes(serviceTypesData);
        
        // Fetch calendar connections
        try {
          const connectionsData = await getUserCalendarConnections();
          setCalendarConnections(connectionsData.filter(conn => conn.is_active));
        } catch (err) {
          console.error('Error loading calendar connections:', err);
          // Not critical, can continue without
        }
        
        // If editing an existing appointment, load its data
        if (appointmentId) {
          const appointmentData = await getAppointmentById(appointmentId);
          
          // Format the date
          const appointmentDate = appointmentData.date 
            ? new Date(appointmentData.date) 
            : new Date();
            
          form.reset({
            customer_id: appointmentData.customer_id,
            employee_id: appointmentData.employee_id,
            service_type: appointmentData.service_type,
            date: appointmentDate,
            start_time: appointmentData.start_time,
            end_time: appointmentData.end_time,
            status: appointmentData.status,
            notes: appointmentData.notes,
            send_confirmation: true,
            sync_with_calendar: true,
            calendar_id: ''
          });
        } else if (initialDate) {
          form.setValue('date', initialDate);
        }
        
        if (initialTime) {
          form.setValue('start_time', initialTime);
          form.setValue('end_time', calculateEndTime(initialTime, 60));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('שגיאה בטעינת נתונים');
      }
    };
    
    fetchData();
  }, [appointmentId, form, initialDate, initialTime]);
  
  // Update end time when start time or service changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'start_time' && value.start_time) {
        form.setValue('end_time', calculateEndTime(value.start_time as string, 60));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Form submission handler
  const onSubmit = async (data: AppointmentFormSchema) => {
    try {
      setLoading(true);
      
      // Prepare the appointment data
      const appointmentData: AppointmentFormData = {
        customer_id: data.customer_id,
        employee_id: data.employee_id,
        service_type: data.service_type,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
        status: data.status,
        notes: data.notes,
      };
      
      let savedAppointmentId: string;
      
      if (appointmentId) {
        // Update existing appointment
        const updated = await updateAppointment(appointmentId, appointmentData);
        savedAppointmentId = updated.id;
        toast.success('הפגישה עודכנה בהצלחה');
      } else {
        // Create new appointment
        const created = await createAppointment(appointmentData);
        savedAppointmentId = created.id;
        toast.success('הפגישה נוצרה בהצלחה');
      }
      
      // Handle calendar sync if enabled
      if (data.sync_with_calendar && data.calendar_id) {
        try {
          await syncAppointmentWithCalendar(savedAppointmentId, data.calendar_id);
          toast.success('הפגישה סונכרנה עם לוח השנה');
        } catch (error) {
          console.error('Error syncing with calendar:', error);
          toast.error('שגיאה בסנכרון עם לוח השנה');
        }
      }
      
      // Send confirmation notification if enabled
      if (data.send_confirmation) {
        try {
          await sendAppointmentNotification(savedAppointmentId, 'confirmation');
          toast.success('הודעת אישור נשלחה ללקוח');
        } catch (error) {
          console.error('Error sending confirmation:', error);
          toast.error('שגיאה בשליחת הודעת אישור');
        }
      }
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast.error('שגיאה בשמירת הפגישה');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">לקוח</FormLabel>
              <Select 
                value={field.value}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר לקוח" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="service_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">סוג שירות</FormLabel>
              <Select 
                value={field.value}
                onValueChange={field.onChange}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג שירות" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceTypes.length > 0 ? (
                    serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))
                  ) : (
                    <>
                      <SelectItem value="מניקור ג׳ל">מניקור ג׳ל</SelectItem>
                      <SelectItem value="בניית ציפורניים">בניית ציפורניים</SelectItem>
                      <SelectItem value="פדיקור">פדיקור</SelectItem>
                      <SelectItem value="לק ג׳ל">לק ג׳ל</SelectItem>
                      <SelectItem value="טיפול פנים">טיפול פנים</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-right">תאריך</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                        disabled={loading}
                      >
                        {field.value ? (
                          format(field.value, 'dd/MM/yyyy')
                        ) : (
                          <span>בחר תאריך</span>
                        )}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={loading}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">עובד</FormLabel>
                <Select 
                  value={field.value || ''}
                  onValueChange={(value) => field.onChange(value || null)}
                  disabled={loading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר עובד (לא חובה)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">ללא עובד ספציפי</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">שעת התחלה</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-right">שעת סיום</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">סטטוס</FormLabel>
              <Select 
                value={field.value}
                onValueChange={(value) => field.onChange(value as 'scheduled' | 'completed' | 'cancelled')}
                disabled={loading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סטטוס" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="scheduled">מתוכנן</SelectItem>
                  <SelectItem value="completed">הושלם</SelectItem>
                  <SelectItem value="cancelled">בוטל</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-right">הערות</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="הערות לגבי הפגישה (אופציונלי)"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  disabled={loading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Collapsible
          open={showAdvancedOptions}
          onOpenChange={setShowAdvancedOptions}
          className="w-full space-y-4"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between py-2">
            <span className="text-sm font-medium">אפשרויות מתקדמות</span>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
            >
              <span className="sr-only">Toggle</span>
              {showAdvancedOptions ? "הסתר אפשרויות" : "הצג אפשרויות"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4">
            <Separator />
            
            <FormField
              control={form.control}
              name="send_confirmation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse space-y-0 p-2 border rounded-lg">
                  <div className="space-y-0 leading-none">
                    <FormLabel className="text-right flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      שלח הודעת אישור
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      שלח הודעת WhatsApp או SMS ללקוח
                    </p>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={loading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {calendarConnections.length > 0 ? (
              <>
                <FormField
                  control={form.control}
                  name="sync_with_calendar"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-3 space-x-reverse space-y-0 p-2 border rounded-lg">
                      <div className="space-y-0 leading-none">
                        <FormLabel className="text-right flex items-center">
                          <Share2 className="h-4 w-4 mr-1" />
                          סנכרן עם לוח שנה
                        </FormLabel>
                        <p className="text-sm text-muted-foreground">
                          סנכרן פגישה עם לוח שנה מחובר
                        </p>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={loading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch('sync_with_calendar') && (
                  <FormField
                    control={form.control}
                    name="calendar_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">בחר לוח שנה לסנכרון</FormLabel>
                        <Select 
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={loading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="בחר לוח שנה מחובר" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {calendarConnections.map((connection) => (
                              <SelectItem key={connection.id} value={connection.id}>
                                {connection.calendar_email} ({connection.calendar_type === 'google' ? 'Google' : 
                                connection.calendar_type === 'apple' ? 'Apple' : 'Outlook'})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </>
            ) : (
              <div className="p-2 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">ייצוא פגישה</p>
                    <p className="text-xs text-muted-foreground">
                      הורד את הפגישה כקובץ .ics להוספה ללוח השנה שלך
                    </p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const formValues = form.getValues();
                      downloadIcsFile({
                        date: formValues.date.toISOString().split('T')[0],
                        start_time: formValues.start_time,
                        end_time: formValues.end_time,
                        service_type: formValues.service_type,
                        customer: customers.find(c => c.id === formValues.customer_id)
                      });
                    }}
                    disabled={loading || !form.formState.isValid}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    הורד .ics
                  </Button>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={loading}
          >
            ביטול
          </Button>
          <Button type="submit" disabled={loading}>
            {appointmentId ? 'עדכן פגישה' : 'צור פגישה'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
