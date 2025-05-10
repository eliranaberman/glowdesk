
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

interface CalendarSyncRequest {
  action: 'sync' | 'update' | 'delete' | 'check';
  appointmentId: string;
  calendarConnectionId?: string;
  calendarType?: 'google' | 'apple' | 'outlook';
}

interface AppointmentData {
  id: string;
  customer_id: string;
  service_type: string;
  date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  status: string;
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

// Mock Apple Calendar API interaction
async function syncWithAppleCalendar(
  appointment: AppointmentData,
  calendarConnection: CalendarConnection,
  action: 'sync' | 'update' | 'delete'
): Promise<{ success: boolean; external_id?: string }> {
  console.log(`${action} appointment with Apple Calendar`, {
    appointment,
    calendarEmail: calendarConnection.calendar_email,
  });

  // In a real implementation, this would use the Apple Calendar API
  // For now, simulate a successful operation with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let external_id = appointment.external_calendar_id;
  
  if (action === 'sync' && !external_id) {
    // Generate a mock external calendar ID for new events
    external_id = `apple_event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  } else if (action === 'delete') {
    external_id = undefined;
  }

  return { success: true, external_id };
}

// Mock Outlook Calendar API interaction
async function syncWithOutlookCalendar(
  appointment: AppointmentData,
  calendarConnection: CalendarConnection,
  action: 'sync' | 'update' | 'delete'
): Promise<{ success: boolean; external_id?: string }> {
  console.log(`${action} appointment with Outlook Calendar`, {
    appointment,
    calendarEmail: calendarConnection.calendar_email,
  });

  // In a real implementation, this would use the Microsoft Graph API
  // For now, simulate a successful operation with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let external_id = appointment.external_calendar_id;
  
  if (action === 'sync' && !external_id) {
    // Generate a mock external calendar ID for new events
    external_id = `outlook_event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  } else if (action === 'delete') {
    external_id = undefined;
  }

  return { success: true, external_id };
}

async function syncAppointmentWithAllCalendars(
  appointment: AppointmentData,
  action: 'sync' | 'update' | 'delete'
): Promise<{ success: boolean; results: any[] }> {
  // Get all active calendar connections
  const { data: connections, error: connectionsError } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('is_active', true);
  
  if (connectionsError) {
    console.error('Error fetching calendar connections:', connectionsError);
    return { success: false, results: [] };
  }
  
  if (!connections || connections.length === 0) {
    console.log('No active calendar connections found');
    return { success: true, results: [] };
  }
  
  const results = [];
  let overallSuccess = true;
  
  for (const connection of connections) {
    try {
      let result;
      
      switch (connection.calendar_type) {
        case 'google':
          result = await syncWithGoogleCalendar(appointment, connection, action);
          break;
        case 'apple':
          result = await syncWithAppleCalendar(appointment, connection, action);
          break;
        case 'outlook':
          result = await syncWithOutlookCalendar(appointment, connection, action);
          break;
        default:
          console.warn(`Unsupported calendar type: ${connection.calendar_type}`);
          continue;
      }
      
      results.push({
        connectionId: connection.id,
        calendarType: connection.calendar_type,
        result
      });
      
      if (!result.success) {
        overallSuccess = false;
      }
      
      // Update the external calendar ID if this is the first successful sync
      if (result.success && action === 'sync' && result.external_id && !appointment.external_calendar_id) {
        await supabase
          .from('appointments')
          .update({
            external_calendar_id: result.external_id,
            calendar_sync_status: 'synced',
            last_sync_at: new Date().toISOString()
          })
          .eq('id', appointment.id);
      }
    } catch (error) {
      console.error(`Error syncing with ${connection.calendar_type} calendar:`, error);
      results.push({
        connectionId: connection.id,
        calendarType: connection.calendar_type,
        error: error.message
      });
      overallSuccess = false;
    }
  }
  
  return { success: overallSuccess, results };
}

async function handleCalendarSync(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const requestData: CalendarSyncRequest = await req.json();
    const { action, appointmentId, calendarConnectionId, calendarType } = requestData;

    console.log('Calendar sync request:', requestData);

    // Get the appointment data
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, customer_id, service_type, date, start_time, end_time, notes, status, external_calendar_id,
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

    let result;
    
    // Check if we're syncing with a specific calendar connection or all of them
    if (calendarConnectionId) {
      // Get the specific calendar connection
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

      // Handle based on calendar type
      switch (connection.calendar_type) {
        case 'google':
          result = await syncWithGoogleCalendar(appointment, connection, action);
          break;
        case 'apple':
          result = await syncWithAppleCalendar(appointment, connection, action);
          break;
        case 'outlook':
          result = await syncWithOutlookCalendar(appointment, connection, action);
          break;
        default:
          return new Response(
            JSON.stringify({ error: `Unsupported calendar type: ${connection.calendar_type}` }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
      
      // Update the connection's last_sync_at
      await supabase
        .from('calendar_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', calendarConnectionId);
    } else if (calendarType) {
      // Get all connections of a specific type
      const { data: connections, error: connectionsError } = await supabase
        .from('calendar_connections')
        .select('*')
        .eq('calendar_type', calendarType)
        .eq('is_active', true);
        
      if (connectionsError) {
        console.error('Error fetching calendar connections:', connectionsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch calendar connections' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!connections || connections.length === 0) {
        return new Response(
          JSON.stringify({ message: `No active ${calendarType} calendar connections found` }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const results = [];
      let overallSuccess = true;
      
      for (const connection of connections) {
        let syncResult;
        switch (calendarType) {
          case 'google':
            syncResult = await syncWithGoogleCalendar(appointment, connection, action);
            break;
          case 'apple':
            syncResult = await syncWithAppleCalendar(appointment, connection, action);
            break;
          case 'outlook':
            syncResult = await syncWithOutlookCalendar(appointment, connection, action);
            break;
        }
        
        results.push({
          connectionId: connection.id,
          result: syncResult
        });
        
        if (!syncResult.success) {
          overallSuccess = false;
        }
        
        // Update the connection's last_sync_at
        await supabase
          .from('calendar_connections')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', connection.id);
      }
      
      result = {
        success: overallSuccess,
        results
      };
    } else {
      // Sync with all calendar connections
      result = await syncAppointmentWithAllCalendars(appointment, action);
    }

    // Update the appointment with the result
    if (result.success) {
      const updateData: Record<string, any> = {
        calendar_sync_status: 'synced',
        last_sync_at: new Date().toISOString()
      };

      // Only update external_calendar_id if action is 'sync' and we have an external_id
      if (action === 'sync' && result.external_id !== undefined) {
        updateData.external_calendar_id = result.external_id;
      }
      
      // If action is 'delete', clear external_calendar_id
      if (action === 'delete') {
        updateData.external_calendar_id = null;
        updateData.calendar_sync_status = 'removed';
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
    }

    return new Response(
      JSON.stringify({ success: result.success, result }),
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
