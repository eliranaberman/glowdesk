
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
  action?: 'validate' | 'cancel';
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token, reason, action = 'cancel' } = await req.json() as CancellationRequest;

    if (!token) {
      return new Response(
        JSON.stringify({ error: true, message: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate token and get appointment ID
    const { data: tokenData, error: tokenError } = await supabase
      .from('cancellation_tokens')
      .select('appointment_id, expires_at, used')
      .eq('token', token)
      .single();
    
    if (tokenError) {
      console.error('Invalid token:', tokenError);
      return new Response(
        JSON.stringify({ error: true, message: 'Invalid cancellation token' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if token is expired
    const isExpired = new Date(tokenData.expires_at) < new Date();
    
    // Check if token has already been used
    const isUsed = tokenData.used;
    
    // Get appointment details
    const appointmentId = tokenData.appointment_id;
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, service_type, date, start_time, end_time, status,
        customers:customer_id (id, full_name, email, phone_number)
      `)
      .eq('id', appointmentId)
      .single();
    
    if (appointmentError) {
      console.error('Error fetching appointment:', appointmentError);
      return new Response(
        JSON.stringify({ error: true, message: 'Appointment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if appointment is already cancelled
    const isCancelled = appointmentData.status === 'cancelled';
    
    // Check if this is a late cancellation
    const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.start_time}`);
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isLateCancellation = hoursDifference < 6;
    
    // If just validating, return the appointment details
    if (action === 'validate') {
      return new Response(
        JSON.stringify({
          isExpired,
          isUsed,
          isCancelled,
          isLateCancellation,
          appointment: {
            id: appointmentData.id,
            service_type: appointmentData.service_type,
            date: appointmentData.date,
            start_time: appointmentData.start_time,
            end_time: appointmentData.end_time,
            customer_name: appointmentData.customers?.full_name
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If token is expired or used or appointment is already cancelled, return error
    if (isExpired) {
      return new Response(
        JSON.stringify({ error: true, message: 'Cancellation token has expired' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (isUsed) {
      return new Response(
        JSON.stringify({ error: true, message: 'Cancellation token has already been used' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (isCancelled) {
      return new Response(
        JSON.stringify({ error: true, message: 'Appointment is already cancelled' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Cancel the appointment
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        status: 'cancelled',
        cancel_reason: reason || null,
        cancelled_at: new Date().toISOString(),
        late_cancellation: isLateCancellation,
        // Only set payment_required for late cancellations at this stage
        // The admin can turn this off later if needed
        payment_required: isLateCancellation
      })
      .eq('id', appointmentId);
    
    if (updateError) {
      console.error('Error updating appointment:', updateError);
      return new Response(
        JSON.stringify({ error: true, message: 'Failed to cancel appointment' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Mark the token as used
    const { error: tokenUpdateError } = await supabase
      .from('cancellation_tokens')
      .update({ used: true })
      .eq('token', token);
    
    if (tokenUpdateError) {
      console.error('Error marking token as used:', tokenUpdateError);
      // Non-critical error, can continue
    }

    // Try to send cancellation notification
    try {
      await supabase.functions.invoke('whatsapp-notification', {
        body: {
          appointmentId,
          notificationType: 'cancellation',
          customMessage: reason ? `הפגישה בוטלה. סיבה: ${reason}` : undefined
        }
      });
    } catch (notificationError) {
      console.error('Error sending cancellation notification:', notificationError);
      // Non-critical error, can continue
    }

    // Check waiting list for this service type and notify if there are people waiting
    try {
      const { data: waitingList, error: waitingListError } = await supabase
        .from('appointment_waiting_list')
        .select('id, customer_id, customers:customer_id (phone_number)')
        .eq('service_type', appointmentData.service_type)
        .eq('status', 'waiting')
        .order('created_at', { ascending: true })
        .limit(3);
      
      if (!waitingListError && waitingList?.length > 0) {
        // Check if the appointment is in the near future (next 7 days)
        const isNearFuture = hoursDifference < 24 * 7;
        
        if (isNearFuture) {
          // Notify the first person on the waiting list
          const firstInLine = waitingList[0];
          if (firstInLine.customers?.phone_number) {
            await supabase.functions.invoke('whatsapp-notification', {
              body: {
                notificationType: 'waiting_list',
                phoneNumber: firstInLine.customers.phone_number,
                customMessage: `שלום! התפנה מקום עבור טיפול ${appointmentData.service_type} ב-${new Date(appointmentData.date).toLocaleDateString('he-IL')} בשעה ${appointmentData.start_time}. ליצירת קשר וקביעת תור התקשר/י אלינו.`
              }
            });
            
            // Update waiting list status to 'notified'
            await supabase
              .from('appointment_waiting_list')
              .update({ status: 'notified', updated_at: new Date().toISOString() })
              .eq('id', firstInLine.id);
          }
        }
      }
    } catch (waitingListError) {
      console.error('Error processing waiting list:', waitingListError);
      // Non-critical error, can continue
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Appointment cancelled successfully',
        isLateCancellation
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in appointment-cancellation function:', error);
    return new Response(
      JSON.stringify({ error: true, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
