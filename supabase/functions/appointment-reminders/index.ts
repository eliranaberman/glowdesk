
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Appointment reminders function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get tomorrow's date (24 hours from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    console.log('Looking for appointments on:', tomorrowDate);

    // Get all appointments for tomorrow that haven't had reminders sent
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        *,
        customers:customer_id (
          id,
          full_name,
          email,
          phone_number
        )
      `)
      .eq('date', tomorrowDate)
      .eq('status', 'scheduled')
      .is('reminder_sent_at', null);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    console.log(`Found ${appointments?.length || 0} appointments needing reminders`);

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No appointments found for reminders' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    for (const appointment of appointments) {
      try {
        // Get user notification preferences
        const { data: preferences } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', appointment.customer_id)
          .single();

        if (!preferences?.appointment_reminders_enabled) {
          console.log(`Reminders disabled for appointment ${appointment.id}`);
          continue;
        }

        // Create reminder message
        const message = `היי ${appointment.customers?.full_name || 'לקוח'}! 
תזכורת לתור מחר (${appointment.date}) בשעה ${appointment.start_time} 
שירות: ${appointment.service_type}
מזכירים בחיבה, צוות GlowDesk`;

        // Log the notification attempt
        await supabase
          .from('notification_logs')
          .insert({
            user_id: appointment.customer_id,
            appointment_id: appointment.id,
            notification_type: 'reminder',
            channel: preferences.whatsapp_enabled ? 'whatsapp' : 
                    preferences.sms_enabled ? 'sms' : 'email',
            status: 'sent',
            message_content: message,
            sent_at: new Date().toISOString()
          });

        // Update appointment to mark reminder as sent
        await supabase
          .from('appointments')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', appointment.id);

        results.push({
          appointmentId: appointment.id,
          customerName: appointment.customers?.full_name,
          status: 'sent'
        });

        console.log(`Reminder sent for appointment ${appointment.id}`);

      } catch (error) {
        console.error(`Error sending reminder for appointment ${appointment.id}:`, error);
        results.push({
          appointmentId: appointment.id,
          status: 'failed',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Reminder processing completed',
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Appointment reminders error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process appointment reminders'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
