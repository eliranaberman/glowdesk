
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GoogleAuthRequest {
  action: 'auth';
  email: string;
}

interface CalendarSyncRequest {
  action: 'sync' | 'update' | 'delete';
  appointmentId: string;
  calendarConnectionId: string;
}

serve(async (req) => {
  console.log('Calendar sync function called with method:', req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body = await req.json();
    console.log('Request body:', body);

    const { action } = body;

    if (action === 'auth') {
      return handleGoogleAuth(body as GoogleAuthRequest);
    } else if (['sync', 'update', 'delete'].includes(action)) {
      return handleCalendarOperation(supabase, body as CalendarSyncRequest);
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('Calendar sync error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Calendar sync operation failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function handleGoogleAuth(request: GoogleAuthRequest): Promise<Response> {
  console.log('Handling Google auth for email:', request.email);

  const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
  const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
  
  if (!clientId || !clientSecret) {
    console.error('Missing Google OAuth credentials');
    throw new Error('Google OAuth credentials not configured');
  }

  // Generate proper redirect URI - using the current origin
  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-sync`;
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `state=${encodeURIComponent(JSON.stringify({ email: request.email }))}`;

  console.log('Generated auth URL:', authUrl);

  return new Response(
    JSON.stringify({ 
      authUrl,
      message: 'Please authorize access to your Google Calendar'
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function handleCalendarOperation(
  supabase: any, 
  request: CalendarSyncRequest
): Promise<Response> {
  console.log('Handling calendar operation:', request.action);

  // Get appointment details
  const { data: appointment, error: appointmentError } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', request.appointmentId)
    .single();

  if (appointmentError || !appointment) {
    console.error('Appointment not found:', appointmentError);
    throw new Error('Appointment not found');
  }

  // Get calendar connection details
  const { data: connection, error: connectionError } = await supabase
    .from('calendar_connections')
    .select('*')
    .eq('id', request.calendarConnectionId)
    .single();

  if (connectionError || !connection) {
    console.error('Calendar connection not found:', connectionError);
    throw new Error('Calendar connection not found');
  }

  console.log('Processing appointment:', appointment);
  console.log('Using connection:', connection);

  // For now, we'll simulate the calendar operation
  // In a real implementation, you would make actual API calls to Google Calendar
  const result = {
    success: true,
    action: request.action,
    appointmentId: request.appointmentId,
    calendarId: connection.calendar_id,
    message: `Calendar ${request.action} operation completed successfully`
  };

  // Update the appointment with calendar sync status
  await supabase
    .from('appointments')
    .update({
      calendar_sync_status: 'synced',
      external_calendar_id: `mock_event_${appointment.id}`,
      last_sync_at: new Date().toISOString()
    })
    .eq('id', request.appointmentId);

  return new Response(
    JSON.stringify(result),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}
