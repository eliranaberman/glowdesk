
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getUserCalendarConnections, 
  syncAppointmentWithCalendar,
  autoSyncAllAppointments 
} from '@/services/calendarService';
import type { CalendarConnection } from '@/services/calendarService';

export const useCalendarSync = () => {
  const [connections, setConnections] = useState<CalendarConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const loadConnections = async () => {
    try {
      setIsLoading(true);
      const data = await getUserCalendarConnections();
      setConnections(data);
    } catch (error) {
      console.error('Error loading calendar connections:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לטעון את חיבורי הלוח',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const syncAppointment = async (appointmentId: string) => {
    const googleConnection = connections.find(c => c.calendar_type === 'google' && c.is_active);
    
    if (!googleConnection) {
      toast({
        title: 'אין חיבור פעיל',
        description: 'יש לחבר Google Calendar תחילה',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsSyncing(true);
      await syncAppointmentWithCalendar(appointmentId, googleConnection.id);
      
      toast({
        title: 'הצלחה!',
        description: 'הפגישה סונכרנה עם Google Calendar',
      });
      
      return true;
    } catch (error) {
      console.error('Error syncing appointment:', error);
      toast({
        title: 'שגיאה בסנכרון',
        description: 'לא ניתן לסנכרן את הפגישה',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const syncAllAppointments = async () => {
    const googleConnection = connections.find(c => c.calendar_type === 'google' && c.is_active);
    
    if (!googleConnection) {
      toast({
        title: 'אין חיבור פעיל',
        description: 'יש לחבר Google Calendar תחילה',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSyncing(true);
      await autoSyncAllAppointments(googleConnection.id);
      
      toast({
        title: 'הצלחה!',
        description: 'כל הפגישות סונכרנו עם Google Calendar',
      });
    } catch (error) {
      console.error('Error syncing all appointments:', error);
      toast({
        title: 'שגיאה בסנכרון',
        description: 'לא ניתן לסנכרן את הפגישות',
        variant: 'destructive',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  return {
    connections,
    isLoading,
    isSyncing,
    loadConnections,
    syncAppointment,
    syncAllAppointments,
    hasGoogleConnection: connections.some(c => c.calendar_type === 'google' && c.is_active),
  };
};
