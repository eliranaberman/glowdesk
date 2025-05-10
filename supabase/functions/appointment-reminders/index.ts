
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Set up the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppointmentWithCustomer {
  id: string;
  customer_id: string;
  employee_id: string | null;
  service_type: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  reminder_24h_sent: boolean;
  reminder_3h_sent: boolean;
  customers: {
    id: string;
    full_name: string;
    email: string;
    phone_number: string;
  };
  employees?: {
    full_name: string;
  };
}

async function sendWhatsAppReminder(appointment: AppointmentWithCustomer, reminderType: '24h' | '3h'): Promise<boolean> {
  try {
    // Format date and time
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('he-IL');
    
    // Get Google Maps link if available
    const businessSettings = await getBusinessSettings();
    const mapsLink = businessSettings?.location_url 
      ? `\n\nלניווט למיקום: ${businessSettings.location_url}` 
      : '';
    
    // Create appropriate message based on reminder type
    let message = '';
    if (reminderType === '24h') {
      message = `שלום ${appointment.customers.full_name}, 
תזכורת: הפגישה שלך ל${appointment.service_type} מתוכננת מחר, ${formattedDate}, בשעה ${appointment.start_time}.
אנחנו מצפים לראותך!${mapsLink}
לביטול הפגישה לחצ/י כאן: {cancellation_link}`;
    } else {
      message = `שלום ${appointment.customers.full_name}, 
תזכורת: הפגישה שלך ל${appointment.service_type} מתוכננת היום בשעה ${appointment.start_time}.
אנחנו מצפים לראותך!${mapsLink}`;
    }
    
    // Create a cancellation link
    const cancellationLink = await generateCancellationLink(appointment.id);
    message = message.replace('{cancellation_link}', cancellationLink);
    
    // Call the notification function
    const { data, error } = await supabase.functions.invoke('whatsapp-notification', {
      body: {
        appointmentId: appointment.id,
        notificationType: reminderType === '24h' ? 'reminder_24h' : 'reminder_3h',
        customMessage: message
      }
    });
    
    if (error) {
      console.error(`Error sending ${reminderType} reminder:`, error);
      return false;
    }
    
    console.log(`Successfully sent ${reminderType} reminder for appointment ${appointment.id}`);
    return data?.success || false;
  } catch (error) {
    console.error(`Error in sendWhatsAppReminder for ${reminderType}:`, error);
    return false;
  }
}

async function getBusinessSettings() {
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching business settings:', error);
    return null;
  }
  
  return data;
}

async function generateCancellationLink(appointmentId: string): Promise<string> {
  const { data, error } = await supabase
    .from('cancellation_tokens')
    .insert({
      appointment_id: appointmentId,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    })
    .select('token')
    .single();
  
  if (error) {
    console.error('Error generating cancellation token:', error);
    return '#';
  }
  
  return `https://your-glowdesk-url.com/cancel-appointment/${data.token}`;
}

async function processUpcomingAppointments(): Promise<void> {
  const now = new Date();
  
  // Get current time in target timezone (Israel Standard Time)
  const currentTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(now);
  
  // Get current date in YYYY-MM-DD format
  const currentDate = now.toISOString().split('T')[0];
  
  // Date 24 hours from now
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().split('T')[0];
  
  console.log(`Processing reminders at ${currentTime} for ${currentDate} and ${tomorrowDate}`);
  
  // Process 24-hour reminders - Find all appointments scheduled for tomorrow
  const { data: appointments24h, error: error24h } = await supabase
    .from('appointments')
    .select(`
      *,
      customers:customer_id (id, full_name, email, phone_number),
      employees:employee_id (full_name)
    `)
    .eq('date', tomorrowDate)
    .eq('status', 'scheduled')
    .eq('reminder_24h_sent', false);
  
  if (error24h) {
    console.error('Error fetching 24h upcoming appointments:', error24h);
  } else {
    console.log(`Processing ${appointments24h?.length || 0} 24-hour reminders`);
    
    if (appointments24h && appointments24h.length > 0) {
      for (const appointment of appointments24h) {
        const success = await sendWhatsAppReminder(appointment, '24h');
        
        if (success) {
          // Update the appointment to mark the reminder as sent
          const { error: updateError } = await supabase
            .from('appointments')
            .update({ 
              reminder_24h_sent: true,
              updated_at: new Date().toISOString() 
            })
            .eq('id', appointment.id);
          
          if (updateError) {
            console.error(`Error updating appointment ${appointment.id} after sending 24h reminder:`, updateError);
          }
        }
      }
    }
  }
  
  // Process 3-hour reminders - Find all appointments scheduled for today
  // Calculate what time it will be in 3 hours
  const threeHoursFromNow = new Date(now);
  threeHoursFromNow.setHours(threeHoursFromNow.getHours() + 3);
  
  // Format to HH:MM to match our time format in the database
  const threeHoursFromNowTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(threeHoursFromNow);
  
  // Get the current hour
  const currentHour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem',
    hour: '2-digit',
    hour12: false
  }).format(now);
  
  // Convert to 24-hour format from return format "14 PM" to "14:00"
  const targetHour = `${currentHour.padStart(2, '0')}:00`;
  
  console.log(`Current hour: ${targetHour}, processing 3h reminders for appointments around ${threeHoursFromNowTime}`);
  
  const { data: appointments3h, error: error3h } = await supabase
    .from('appointments')
    .select(`
      *,
      customers:customer_id (id, full_name, email, phone_number),
      employees:employee_id (full_name)
    `)
    .eq('date', currentDate)
    .eq('status', 'scheduled')
    .eq('reminder_3h_sent', false)
    .gte('start_time', threeHoursFromNowTime)
    .lt('start_time', `${(parseInt(currentHour) + 3).toString().padStart(2, '0')}:59`);
  
  if (error3h) {
    console.error('Error fetching 3h upcoming appointments:', error3h);
  } else {
    console.log(`Processing ${appointments3h?.length || 0} 3-hour reminders`);
    
    if (appointments3h && appointments3h.length > 0) {
      for (const appointment of appointments3h) {
        const success = await sendWhatsAppReminder(appointment, '3h');
        
        if (success) {
          // Update the appointment to mark the reminder as sent
          const { error: updateError } = await supabase
            .from('appointments')
            .update({ 
              reminder_3h_sent: true,
              updated_at: new Date().toISOString() 
            })
            .eq('id', appointment.id);
          
          if (updateError) {
            console.error(`Error updating appointment ${appointment.id} after sending 3h reminder:`, updateError);
          }
        }
      }
    }
  }
  
  console.log('Finished processing appointment reminders');
}

async function handleRequest(req: Request): Promise<Response> {
  try {
    // Process all upcoming appointments that need reminders
    await processUpcomingAppointments();
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment reminders processed successfully',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error processing appointment reminders:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

// Handle CORS preflight requests
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return handleRequest(req);
});
