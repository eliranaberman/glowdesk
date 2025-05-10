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

interface NotificationRequest {
  appointmentId?: string;
  notificationType: 'confirmation' | 'reminder_24h' | 'reminder_3h' | 'cancellation' | 'waiting_list' | 'custom';
  customMessage?: string;
  phoneNumber?: string;
  adminNotification?: boolean;
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);
  
  // In a real implementation, this would integrate with the WhatsApp Business API
  // For now, simulate success with a random occasional failure
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate successful delivery 80% of the time
  return Math.random() > 0.2;
}

async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
  console.log(`Sending SMS to ${phoneNumber}: ${message}`);
  
  // In a real implementation, this would integrate with an SMS provider
  // For now, simulate success
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate successful delivery 95% of the time
  return Math.random() > 0.05;
}

async function generateCancellationToken(appointmentId: string): Promise<string> {
  // Generate a secure random token
  const tokenBuffer = new Uint8Array(32);
  crypto.getRandomValues(tokenBuffer);
  const token = Array.from(tokenBuffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Store the token in the database
  const { data, error } = await supabase
    .from('cancellation_tokens')
    .insert({
      token,
      appointment_id: appointmentId,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
    })
    .select('token')
    .single();
  
  if (error) {
    console.error('Error generating cancellation token:', error);
    return '';
  }
  
  return data.token;
}

async function handleNotification(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const requestData: NotificationRequest = await req.json();
    const { appointmentId, notificationType, customMessage, phoneNumber, adminNotification } = requestData;

    console.log('Notification request:', requestData);

    let appointment;
    let customerPhone;
    
    // If a custom message and phone number are provided directly, use those
    if (customMessage && phoneNumber) {
      return await sendDirectMessage(phoneNumber, customMessage);
    }
    
    // Otherwise, we need an appointment ID
    if (!appointmentId) {
      return new Response(
        JSON.stringify({ error: 'Appointment ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get the appointment data with customer information
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, customer_id, employee_id, service_type, date, start_time, end_time, notes,
        customers:customer_id (id, full_name, email, phone_number),
        employees:employee_id (id, full_name)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointmentData) {
      console.error('Error fetching appointment:', appointmentError);
      return new Response(
        JSON.stringify({ error: 'Appointment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    appointment = appointmentData;
    
    // If it's an admin notification, get the admin's phone
    if (adminNotification) {
      const { data: settings } = await supabase
        .from('business_settings')
        .select('admin_phone')
        .single();
        
      customerPhone = settings?.admin_phone;
      
      if (!customerPhone) {
        console.error('Admin phone not found in settings');
        return new Response(
          JSON.stringify({ error: 'Admin phone not configured' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Check if customer has phone number
      if (!appointment.customers?.phone_number) {
        return new Response(
          JSON.stringify({ error: 'Customer has no phone number' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      customerPhone = appointment.customers.phone_number;
    }

    const phoneNumber = customerPhone;
    const customerName = appointment.customers.full_name;
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('he-IL');
    const formattedTime = appointment.start_time;
    const service = appointment.service_type;
    const employeeName = appointment.employees?.full_name || 'הצוות שלנו';

    let message = customMessage;
    
    // If no custom message is provided, create message based on notification type
    if (!message) {
      message = await createMessageFromTemplate(notificationType, {
        customerName,
        service,
        date: formattedDate,
        time: formattedTime,
        employeeName,
        appointmentId
      });
    }

    // Get notification preferences for the service provider
    const { data: preferences } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', appointment.employee_id || 'default')
      .maybeSingle();

    const whatsappEnabled = preferences?.whatsapp_enabled ?? true;
    const smsFallbackEnabled = preferences?.sms_fallback_enabled ?? true;

    let whatsappSuccess = false;
    let smsSuccess = false;
    let method = '';

    // Try WhatsApp first if enabled
    if (whatsappEnabled) {
      whatsappSuccess = await sendWhatsAppMessage(phoneNumber, message);
      if (whatsappSuccess) {
        method = 'whatsapp';
      }
    }

    // Try SMS fallback if WhatsApp failed and SMS fallback is enabled
    if (!whatsappSuccess && smsFallbackEnabled) {
      smsSuccess = await sendSMS(phoneNumber, message);
      if (smsSuccess) {
        method = 'sms';
      }
    }

    // Update the appointment with notification status
    const updateData: Record<string, any> = {
      notification_sent_at: new Date().toISOString()
    };

    if (method === 'whatsapp') {
      updateData.whatsapp_notification_sent = true;
    } else if (method === 'sms') {
      updateData.sms_notification_sent = true;
    }

    if (notificationType === 'reminder_24h') {
      updateData.reminder_24h_sent = true;
    } else if (notificationType === 'reminder_3h') {
      updateData.reminder_3h_sent = true;
    }

    if (whatsappSuccess || smsSuccess) {
      const { error: updateError } = await supabase
        .from('appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (updateError) {
        console.error('Error updating appointment after notification:', updateError);
      }
    }

    const success = whatsappSuccess || smsSuccess;
    
    return new Response(
      JSON.stringify({ 
        success, 
        method: success ? method : null,
        whatsappStatus: whatsappEnabled ? (whatsappSuccess ? 'sent' : 'failed') : 'disabled',
        smsStatus: smsFallbackEnabled && !whatsappSuccess ? (smsSuccess ? 'sent' : 'failed') : 'not_attempted'
      }),
      { status: success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in whatsapp-notification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function sendDirectMessage(phoneNumber: string, message: string): Promise<Response> {
  // Try WhatsApp first
  const whatsappSuccess = await sendWhatsAppMessage(phoneNumber, message);
  
  // Try SMS as fallback
  const smsSuccess = !whatsappSuccess ? await sendSMS(phoneNumber, message) : false;
  
  const success = whatsappSuccess || smsSuccess;
  const method = whatsappSuccess ? 'whatsapp' : (smsSuccess ? 'sms' : null);
  
  return new Response(
    JSON.stringify({ 
      success, 
      method,
      whatsappStatus: whatsappSuccess ? 'sent' : 'failed',
      smsStatus: !whatsappSuccess ? (smsSuccess ? 'sent' : 'failed') : 'not_attempted'
    }),
    { status: success ? 200 : 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function createMessageFromTemplate(
  type: string, 
  params: { 
    customerName: string; 
    service: string; 
    date: string; 
    time: string; 
    employeeName: string;
    appointmentId: string;
  }
): Promise<string> {
  // Get business settings
  const { data: settings } = await supabase
    .from('business_settings')
    .select('business_name, location_url')
    .single();
  
  const businessName = settings?.business_name || 'GlowDesk';
  const locationUrl = settings?.location_url || '';
  const mapsLink = locationUrl ? `\n\nלניווט למיקום: ${locationUrl}` : '';
  
  // Generate cancellation link if needed
  let cancellationLink = '';
  if (type === 'confirmation' || type === 'reminder_24h') {
    const token = await generateCancellationToken(params.appointmentId);
    if (token) {
      const base = Deno.env.get('PUBLIC_APP_URL') || 'https://your-app-url.com';
      cancellationLink = `${base}/cancel-appointment/${token}`;
    }
  }
  
  const cancellationText = cancellationLink ? 
    `\n\nלביטול התור: ${cancellationLink}` : '';
  
  switch (type) {
    case 'confirmation':
      return `שלום ${params.customerName}, 
      
הפגישה שלך ל${params.service} ב-${params.date} בשעה ${params.time} אושרה.

נשמח לראותך!${mapsLink}${cancellationText}

בברכה,
${businessName}`;

    case 'reminder_24h':
      return `שלום ${params.customerName}, 
      
תזכורת: הפגישה שלך ל${params.service} מתוכננת מחר, ${params.date}, בשעה ${params.time}.

אנחנו מצפים לראותך!${mapsLink}${cancellationText}`;

    case 'reminder_3h':
      return `שלום ${params.customerName}, 
      
תזכורת: הפגישה שלך ל${params.service} מתוכננת היום בשעה ${params.time}.

אנחנו מצפים לראותך!${mapsLink}`;

    case 'cancellation':
      if (params.customerName) {
        return `הודעה אוטומטית: פגישה בוטלה
        
הלקוח/ה ${params.customerName} ביטל/ה את הפגישה ל${params.service} ב-${params.date} בשעה ${params.time}.`;
      } else {
        return `שלום ${params.customerName},

הפגישה שלך ל${params.service} ב-${params.date} בשעה ${params.time} בוטלה.

לתיאום פגישה חדשה, נא ליצור קשר.

בברכה,
${businessName}`;
      }

    default:
      return `שלום ${params.customerName}, הודעה מ-${businessName} בנוגע לפגישה שלך.`;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleNotification(req);
});
