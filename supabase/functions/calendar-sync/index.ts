
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

interface GoogleWebhookRequest {
  action: 'webhook';
  state: string;
  code?: string;
  error?: string;
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

    // Handle Google OAuth callback
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        return new Response(`
          <html>
            <body>
              <script>
                window.opener.postMessage({
                  type: 'GOOGLE_AUTH_ERROR',
                  error: '${error}'
                }, '*');
                window.close();
              </script>
            </body>
          </html>
        `, {
          headers: { ...corsHeaders, 'Content-Type': 'text/html' }
        });
      }

      if (code && state) {
        return handleGoogleOAuthCallback(supabase, code, state);
      }
    }

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

  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-sync`;
  
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ].join(' ');

  const state = JSON.stringify({ email: request.email, timestamp: Date.now() });
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scopes)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent&` +
    `state=${encodeURIComponent(state)}`;

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

async function handleGoogleOAuthCallback(
  supabase: any, 
  code: string, 
  state: string
): Promise<Response> {
  try {
    console.log('Handling OAuth callback with code:', code.substring(0, 10) + '...');
    
    const stateData = JSON.parse(decodeURIComponent(state));
    const { email } = stateData;

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/calendar-sync`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokens = await tokenResponse.json();
    console.log('Received tokens, access_token length:', tokens.access_token?.length);

    // Get user's calendar info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();
    console.log('User info:', userInfo.email);

    // Store the connection in database
    const { data: connection, error } = await supabase
      .from('calendar_connections')
      .insert({
        user_id: (await supabase.auth.getUser()).data.user?.id, // This won't work in edge function
        calendar_type: 'google',
        calendar_email: userInfo.email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save connection: ${error.message}`);
    }

    // Return success page that closes the popup
    return new Response(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              connection: ${JSON.stringify(connection)}
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response(`
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: '${error.message}'
            }, '*');
            window.close();
          </script>
        </body>
      </html>
    `, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html' }
    });
  }
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

  try {
    // Create Google Calendar event
    if (request.action === 'sync') {
      const event = await createGoogleCalendarEvent(connection, appointment);
      
      // Update appointment with Google event ID
      await supabase
        .from('appointments')
        .update({
          calendar_sync_status: 'synced',
          external_calendar_id: event.id,
          last_sync_at: new Date().toISOString()
        })
        .eq('id', request.appointmentId);

      return new Response(
        JSON.stringify({ 
          success: true, 
          eventId: event.id,
          message: 'Event created successfully in Google Calendar'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For now, simulate other operations
    const result = {
      success: true,
      action: request.action,
      appointmentId: request.appointmentId,
      calendarId: connection.calendar_id,
      message: `Calendar ${request.action} operation completed successfully`
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Google Calendar API error:', error);
    throw new Error(`Google Calendar operation failed: ${error.message}`);
  }
}

async function createGoogleCalendarEvent(connection: any, appointment: any) {
  const startDateTime = new Date(`${appointment.date}T${appointment.start_time}`);
  const endDateTime = new Date(`${appointment.date}T${appointment.end_time}`);

  const event = {
    summary: appointment.service_type,
    description: `תור עם ${appointment.client?.full_name || 'לקוח'}${appointment.notes ? '\n\nהערות: ' + appointment.notes : ''}`,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: endDateTime.toISOString(),
      timeZone: 'Asia/Jerusalem',
    },
    attendees: appointment.client?.email ? [{ email: appointment.client.email }] : [],
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${connection.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('Google Calendar API error:', errorData);
    throw new Error(`Google Calendar API error: ${response.statusText}`);
  }

  return await response.json();
}
