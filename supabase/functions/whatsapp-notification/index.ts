
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
  appointmentId: string;
  notificationType: 'confirmation' | 'reminder' | 'cancellation';
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

async function handleNotification(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const requestData: NotificationRequest = await req.json();
    const { appointmentId, notificationType } = requestData;

    console.log('Notification request:', requestData);

    // Get the appointment data with customer information
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id, customer_id, service_type, date, start_time, end_time, notes,
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

    // Check if customer has phone number
    if (!appointment.customers?.phone_number) {
      return new Response(
        JSON.stringify({ error: 'Customer has no phone number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const phoneNumber = appointment.customers.phone_number;
    const customerName = appointment.customers.full_name;
    const appointmentDate = new Date(appointment.date);
    const formattedDate = appointmentDate.toLocaleDateString('he-IL');
    const formattedTime = appointment.start_time;
    const service = appointment.service_type;

    // Create message based on notification type
    let message = '';
    switch (notificationType) {
      case 'confirmation':
        message = `שלום ${customerName}, הפגישה שלך ל${service} ב-${formattedDate} בשעה ${formattedTime} אושרה. נשמח לראותך!`;
        break;
      case 'reminder':
        message = `תזכורת: הפגישה שלך ל${service} מתוכננת מחר, ${formattedDate}, בשעה ${formattedTime}. אנחנו מצפים לראותך!`;
        break;
      case 'cancellation':
        message = `שלום ${customerName}, הפגישה שלך ל${service} ב-${formattedDate} בשעה ${formattedTime} בוטלה. צור קשר איתנו לתיאום מועד חדש.`;
        break;
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleNotification(req);
});
