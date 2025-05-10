
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

interface CancellationRequest {
  token: string;
  reason?: string;
}

async function handleCancellation(req: Request): Promise<Response> {
  try {
    const { token, reason }: CancellationRequest = await req.json();
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'Missing cancellation token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate the token and get the appointment ID
    const { data: tokenData, error: tokenError } = await supabase
      .from('cancellation_tokens')
      .select('appointment_id, expires_at')
      .eq('token', token)
      .single();
    
    if (tokenError || !tokenData) {
      console.error('Invalid or expired cancellation token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired cancellation token' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return new Response(
        JSON.stringify({ error: 'Cancellation token has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const appointmentId = tokenData.appointment_id;
    
    // Get the appointment details
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, customer_id, employee_id, service_type, date, start_time, end_time, status,
        customers:customer_id (id, full_name, email, phone_number)
      `)
      .eq('id', appointmentId)
      .single();
    
    if (appointmentError || !appointment) {
      console.error('Error fetching appointment:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the appointment is already cancelled
    if (appointment.status === 'cancelled') {
      return new Response(
        JSON.stringify({ message: 'Appointment is already cancelled' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if this is a late cancellation (less than 6 hours before)
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.start_time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isLateCancellation = hoursDifference < 6;
    
    // Update the appointment status
    const { data: updatedAppointment, error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancel_reason: reason || 'Customer cancelled via link',
        cancelled_at: new Date().toISOString(),
        late_cancellation: isLateCancellation,
        payment_required: isLateCancellation,
        updated_at: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error cancelling appointment:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to cancel appointment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Mark the token as used
    await supabase
      .from('cancellation_tokens')
      .update({
        used: true,
        used_at: new Date().toISOString()
      })
      .eq('token', token);
      
    // Notify the business about the cancellation
    try {
      await supabase.functions.invoke('whatsapp-notification', {
        body: {
          appointmentId,
          notificationType: 'cancellation',
          adminNotification: true
        }
      });
    } catch (notifError) {
      console.error('Error sending cancellation notification:', notifError);
      // Continue processing even if notification fails
    }
    
    // Check waiting list for this service type and notify if anyone is waiting
    await notifyWaitingListAboutAvailableSlot(appointment);
    
    // Try to sync with external calendars
    try {
      await supabase.functions.invoke('calendar-sync', {
        body: {
          action: isLateCancellation ? 'update' : 'delete',
          appointmentId
        }
      });
    } catch (syncError) {
      console.error('Error syncing calendar after cancellation:', syncError);
      // Continue processing even if calendar sync fails
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Appointment cancelled successfully',
        isLateCancellation,
        appointment: updatedAppointment
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in appointment-cancellation function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function notifyWaitingListAboutAvailableSlot(appointment: any): Promise<void> {
  // Get clients from waiting list who are waiting for this service type
  const { data: waitingClients, error: waitingError } = await supabase
    .from('appointment_waiting_list')
    .select(`
      id, customer_id, service_type, preferred_date,
      clients:customer_id (id, full_name, email, phone_number)
    `)
    .eq('service_type', appointment.service_type)
    .eq('status', 'waiting')
    .order('created_at', { ascending: true })
    .limit(3); // Get top 3 waiting clients
  
  if (waitingError || !waitingClients || waitingClients.length === 0) {
    console.log('No waiting clients found or error:', waitingError);
    return;
  }
  
  // Notify the first client in the waiting list
  const clientToNotify = waitingClients[0];
  
  // Update waiting list entry status
  await supabase
    .from('appointment_waiting_list')
    .update({
      status: 'notified',
      updated_at: new Date().toISOString()
    })
    .eq('id', clientToNotify.id);
  
  // Get business settings for personalization
  const { data: settings } = await supabase
    .from('business_settings')
    .select('business_name, booking_url')
    .single();
  
  const businessName = settings?.business_name || 'GlowDesk';
  const bookingUrl = settings?.booking_url || 'https://your-booking-url.com';
  
  // Send WhatsApp notification to the waiting client
  try {
    const message = `שלום ${clientToNotify.clients.full_name},
    
יש לנו חדשות טובות! התפנה תור ל${appointment.service_type} ב-${new Date(appointment.date).toLocaleDateString('he-IL')} בשעה ${appointment.start_time}.

אם את/ה מעוניין/ת לקבוע את התור, אנא לחץ/י על הקישור: ${bookingUrl}

התור יישמר לך למשך 3 שעות בלבד.

בברכה,
${businessName}`;

    // Create a custom notification for the waiting client
    await supabase.functions.invoke('whatsapp-notification', {
      body: {
        phoneNumber: clientToNotify.clients.phone_number,
        customMessage: message,
        notificationType: 'waiting_list'
      }
    });
    
    console.log(`Notified waiting client ${clientToNotify.clients.full_name} about available slot`);
  } catch (error) {
    console.error('Error notifying waiting client:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleCancellation(req);
});
