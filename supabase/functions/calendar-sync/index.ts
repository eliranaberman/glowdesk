
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.23.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID') || '';
const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CalendarSyncRequest {
  action: 'sync' | 'update' | 'delete' | 'auth' | 'callback';
  appointmentId?: string;
  calendarConnectionId?: string;
  code?: string; // OAuth authorization code
  email?: string;
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

// Generate OAuth URL for Google Calendar
function generateGoogleAuthUrl(email: string): string {
  const redirectUri = `${supabaseUrl}/functions/v1/calendar-sync`;
  const scope = 'https://www.googleapis.com/auth/calendar';
  const state = btoa(JSON.stringify({ email, timestamp: Date.now() }));
  
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    scope: scope,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: state,
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// Exchange authorization code for tokens
async function exchangeCodeForTokens(code: string): Promise<any> {
  const redirectUri = `${supabaseUrl}/functions/v1/calendar-sync`;
  
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange failed: ${error}`);
  }
  
  return await response.json();
}

// Refresh access token
async function refreshAccessToken(refreshToken: string): Promise<any> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${error}`);
  }
  
  return await response.json();
}

// Create event in Google Calendar
async function createGoogleCalendarEvent(
  appointment: AppointmentData,
  accessToken: string
): Promise<{ success: boolean; external_id?: string }> {
  const startDateTime = `${appointment.date}T${appointment.start_time}:00`;
  const endDateTime = `${appointment.date}T${appointment.end_time}:00`;
  
  const event = {
    summary: appointment.service_type,
    description: `פגישה עם ${appointment.customer?.full_name || 'לקוח'}\n${appointment.notes || ''}`,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Jerusalem',
    },
    attendees: appointment.customer?.email ? [
      { email: appointment.customer.email }
    ] : [],
  };
  
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Google Calendar API error:', error);
    throw new Error(`Failed to create calendar event: ${error}`);
  }
  
  const createdEvent = await response.json();
  return { success: true, external_id: createdEvent.id };
}

// Update event in Google Calendar
async function updateGoogleCalendarEvent(
  appointment: AppointmentData,
  accessToken: string,
  eventId: string
): Promise<{ success: boolean }> {
  const startDateTime = `${appointment.date}T${appointment.start_time}:00`;
  const endDateTime = `${appointment.date}T${appointment.end_time}:00`;
  
  const event = {
    summary: appointment.service_type,
    description: `פגישה עם ${appointment.customer?.full_name || 'לקוח'}\n${appointment.notes || ''}`,
    start: {
      dateTime: startDateTime,
      timeZone: 'Asia/Jerusalem',
    },
    end: {
      dateTime: endDateTime,
      timeZone: 'Asia/Jerusalem',
    },
    attendees: appointment.customer?.email ? [
      { email: appointment.customer.email }
    ] : [],
  };
  
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error('Google Calendar API error:', error);
    throw new Error(`Failed to update calendar event: ${error}`);
  }
  
  return { success: true };
}

// Delete event from Google Calendar
async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<{ success: boolean }> {
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok && response.status !== 410) { // 410 means already deleted
    const error = await response.text();
    console.error('Google Calendar API error:', error);
    throw new Error(`Failed to delete calendar event: ${error}`);
  }
  
  return { success: true };
}

// Get valid access token (refresh if needed)
async function getValidAccessToken(connection: CalendarConnection): Promise<string> {
  if (!connection.access_token) {
    throw new Error('No access token available');
  }
  
  // Try to use current token first
  const testResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary', {
    headers: {
      'Authorization': `Bearer ${connection.access_token}`,
    },
  });
  
  if (testResponse.ok) {
    return connection.access_token;
  }
  
  // Token is invalid, try to refresh
  if (!connection.refresh_token) {
    throw new Error('No refresh token available, re-authentication required');
  }
  
  const tokenData = await refreshAccessToken(connection.refresh_token);
  
  // Update the connection with new token
  await supabase
    .from('calendar_connections')
    .update({
      access_token: tokenData.access_token,
      token_expiry: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', connection.id);
  
  return tokenData.access_token;
}

async function handleCalendarSync(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    
    // Handle OAuth callback
    if (url.searchParams.has('code') && url.searchParams.has('state')) {
      const code = url.searchParams.get('code')!;
      const state = url.searchParams.get('state')!;
      
      try {
        const stateData = JSON.parse(atob(state));
        const { email } = stateData;
        
        // Exchange code for tokens
        const tokenData = await exchangeCodeForTokens(code);
        
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        // Create or update calendar connection
        const { data: existingConnection } = await supabase
          .from('calendar_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('calendar_type', 'google')
          .eq('calendar_email', userInfo.email)
          .single();
        
        if (existingConnection) {
          // Update existing connection
          await supabase
            .from('calendar_connections')
            .update({
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              token_expiry: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
              is_active: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingConnection.id);
        } else {
          // Create new connection
          await supabase
            .from('calendar_connections')
            .insert({
              user_id: user.id,
              calendar_type: 'google',
              calendar_email: userInfo.email,
              calendar_id: 'primary',
              access_token: tokenData.access_token,
              refresh_token: tokenData.refresh_token,
              token_expiry: new Date(Date.now() + (tokenData.expires_in * 1000)).toISOString(),
              is_active: true,
            });
        }
        
        // Redirect back to scheduling page with success
        return Response.redirect(`${supabaseUrl.replace('.supabase.co', '.lovable.app')}/scheduling?auth=success`, 302);
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        return Response.redirect(`${supabaseUrl.replace('.supabase.co', '.lovable.app')}/scheduling?auth=error`, 302);
      }
    }
    
    // Handle regular API requests
    const requestData: CalendarSyncRequest = await req.json();
    const { action, appointmentId, calendarConnectionId, email } = requestData;
    
    console.log('Calendar sync request:', requestData);
    
    if (action === 'auth') {
      // Generate OAuth URL
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required for authentication' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const authUrl = generateGoogleAuthUrl(email);
      return new Response(
        JSON.stringify({ authUrl }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!appointmentId || !calendarConnectionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get appointment data
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
    
    // Get calendar connection
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
    
    if (connection.calendar_type !== 'google') {
      return new Response(
        JSON.stringify({ error: 'Only Google Calendar is supported' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Get valid access token
    const accessToken = await getValidAccessToken(connection);
    
    let result;
    
    if (action === 'sync') {
      result = await createGoogleCalendarEvent(appointment, accessToken);
    } else if (action === 'update') {
      if (!appointment.external_calendar_id) {
        return new Response(
          JSON.stringify({ error: 'No external calendar ID found for this appointment' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      result = await updateGoogleCalendarEvent(appointment, accessToken, appointment.external_calendar_id);
      result.external_id = appointment.external_calendar_id;
    } else if (action === 'delete') {
      if (!appointment.external_calendar_id) {
        return new Response(
          JSON.stringify({ error: 'No external calendar ID found for this appointment' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      result = await deleteGoogleCalendarEvent(accessToken, appointment.external_calendar_id);
      result.external_id = null;
    }
    
    // Update appointment with sync result
    if (result?.success) {
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
      
      // Update calendar connection's last sync
      await supabase
        .from('calendar_connections')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', calendarConnectionId);
    }
    
    return new Response(
      JSON.stringify({ success: result?.success, external_id: result?.external_id }),
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  return handleCalendarSync(req);
});
