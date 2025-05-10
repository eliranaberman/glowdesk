
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

// Set up the Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarSyncRequest {
  action: 'sync' | 'update' | 'delete';
  appointmentId: string;
  calendarConnectionId: string;
}

interface AppointmentData {
  id: string;
  customer_id: string;
  service_type: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  customer?: {
    full_name: string;
    email: string;
    phone_number: string;
  };
  external_calendar_id?: string | null;
}

interface CalendarConnection {
  id: string;
  calendar_type: 'google' | 'apple' | 'outlook';
  calendar_email: string;
  access_token: string | null;
  refresh_token: string | null;
  calendar_id: string | null;
}

// Mock Google Calendar API interaction
async function syncWithGoogleCalendar(
  appointment: AppointmentData,
  calendarConnection: CalendarConnection,
  action: 'sync' | 'update' | 'delete'
): Promise<{ success: boolean; external_id?: string }> {
  console.log(`${action} appointment with Google Calendar`, {
    appointment,
    calendarEmail: calendarConnection.calendar_email,
  });

  // In a real implementation, this would use the Google Calendar API
  // For now, simulate a successful operation with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let external_id = appointment.external_calendar_id;
  
  if (action === 'sync' && !external_id) {
    // Generate a mock external calendar ID for new events
    external_id = `google_event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  } else if (action === 'delete') {
    external_id = undefined;
  }

  return { success: true, external_id };
}

async function handleCalendarSync(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const requestData: CalendarSyncRequest = await req.json();
    const { action, appointmentId, calendarConnectionId } = requestData;

    console.log('Calendar sync request:', requestData);

    // Get the appointment data
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, customer_id, service_type, date, start_time, end_time, notes, external_calendar_id,
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

    // Get the calendar connection
    const { data: connection, error: connectionError } = await supabase
      .from('calendar_connections')
      .select('*')
      .eq('id', calendarConnectionId)
      .single();

    if (connectionError || !connection) {
      console.error('Error fetching calendar connection:', connectionError);
      return new Response(
        JSON.stringify({ error: 'Calendar connection not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let result;
    
    // Handle based on calendar type
    if (connection.calendar_type === 'google') {
      result = await syncWithGoogleCalendar(appointment, connection, action);
    } else {
      // For other calendar types, we'll just simulate success
      result = { 
        success: true, 
        external_id: appointment.external_calendar_id || `${connection.calendar_type}_event_${Date.now()}` 
      };
    }

    // Update the appointment with the result
    if (result.success) {
      const updateData: Record<string, any> = {
        last_sync_at: new Date().toISOString(),
        calendar_sync_status: 'synced'
      };

      if (result.external_id !== undefined) {
        updateData.external_calendar_id = result.external_id;
      }

      const { error: updateError } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment after sync:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update appointment after sync' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Also update the calendar connection's last_sync_at
      await supabase
        .from('calendar_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', calendarConnectionId);
    }

    return new Response(
      JSON.stringify({ success: result.success, external_id: result.external_id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in calendar-sync function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleCalendarSync(req);
});
