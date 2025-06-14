
import { supabase } from '@/integrations/supabase/client';

export interface AppleCalendarExport {
  success: boolean;
  icsContent?: string;
  error?: string;
}

// Generate ICS content for Apple Calendar
export const generateIcsForApple = (appointment: any): string => {
  const startDate = new Date(`${appointment.date}T${appointment.start_time}`);
  const endDate = new Date(`${appointment.date}T${appointment.end_time}`);
  
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//GlowDesk//Appointment System//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:glow-${appointment.id}@glowdesk.com
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${appointment.service_type}
DESCRIPTION:פגישה עם ${appointment.customer?.full_name || 'לקוח'}\\nשירות: ${appointment.service_type}${appointment.notes ? '\\nהערות: ' + appointment.notes : ''}
LOCATION:סלון יופי - GlowDesk
STATUS:CONFIRMED
TRANSP:OPAQUE
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:תזכורת לפגישה בעוד 15 דקות
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

// Export appointment to Apple Calendar
export const exportToAppleCalendar = (appointment: any): AppleCalendarExport => {
  try {
    const icsContent = generateIcsForApple(appointment);
    return { success: true, icsContent };
  } catch (error) {
    console.error('Error generating ICS for Apple Calendar:', error);
    return { success: false, error: error.message };
  }
};

// Download ICS file for Apple Calendar
export const downloadAppleCalendarFile = (appointment: any): void => {
  const { success, icsContent, error } = exportToAppleCalendar(appointment);
  
  if (!success || !icsContent) {
    console.error('Failed to generate Apple Calendar file:', error);
    return;
  }
  
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `appointment-${appointment.id}.ics`);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Open Apple Calendar with appointment details
export const openInAppleCalendar = (appointment: any): void => {
  const startDate = new Date(`${appointment.date}T${appointment.start_time}`);
  const endDate = new Date(`${appointment.date}T${appointment.end_time}`);
  
  // Format dates for Apple Calendar URL scheme
  const formatAppleDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const title = encodeURIComponent(appointment.service_type);
  const details = encodeURIComponent(`פגישה עם ${appointment.customer?.full_name || 'לקוח'}\nשירות: ${appointment.service_type}`);
  const location = encodeURIComponent('סלון יופי - GlowDesk');
  
  // Apple Calendar URL scheme
  const appleCalendarUrl = `webcal://calendar.apple.com/calendar/add?` +
    `title=${title}&` +
    `startdate=${formatAppleDate(startDate)}&` +
    `enddate=${formatAppleDate(endDate)}&` +
    `description=${details}&` +
    `location=${location}`;
  
  // Try to open in Apple Calendar, fallback to download
  try {
    window.open(appleCalendarUrl, '_blank');
  } catch (error) {
    console.log('Apple Calendar URL scheme not supported, falling back to download');
    downloadAppleCalendarFile(appointment);
  }
};
