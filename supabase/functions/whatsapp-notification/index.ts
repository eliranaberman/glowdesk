
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

// Set up the Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      appointmentId, 
      notificationType, 
      customMessage, 
      adminNotification = false,
      phoneNumber // Direct message support
    } = await req.json();

    // Check if this is a direct message (no appointment lookup needed)
    if (notificationType === 'custom' && phoneNumber) {
      // For demo purposes, we'll just simulate sending a direct message
      console.log(`DEMO: Sending direct message to ${phoneNumber}: ${customMessage}`);
      
      return new Response(
        JSON.stringify({
          success: true,
          method: 'whatsapp',
          whatsappStatus: 'sent',
          smsStatus: 'not_attempted'
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate required parameters for appointment notifications
    if (!appointmentId || !notificationType) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get appointment details with customer info
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .select(`
        id,
        service_type,
        date,
        start_time,
        end_time,
        status,
        customers:customer_id (id, full_name, email, phone_number)
      `)
      .eq('id', appointmentId)
      .single();

    if (appointmentError || !appointment) {
      console.error('Error fetching appointment:', appointmentError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Appointment not found" 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get the customer's phone number
    const customerPhoneNumber = appointment.customers?.phone_number;
    if (!customerPhoneNumber && !adminNotification) {
      console.error('Customer phone number not found');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Customer phone number not found" 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // In a real implementation, we would call a WhatsApp API (Twilio, MessageBird, etc.)
    // For this demo, we'll just simulate the notification and update the database

    // Create different messages based on notification type
    let message = customMessage;
    if (!message) {
      const dateStr = new Date(appointment.date).toLocaleDateString('he-IL');
      const customerName = appointment.customers?.full_name || "";
      
      switch (notificationType) {
        case 'confirmation':
          message = `שלום ${customerName}! פגישתך ל${appointment.service_type} אושרה ל-${dateStr} בשעה ${appointment.start_time}. נשמח לראותך!`;
          break;
        case 'reminder_24h':
          message = `שלום ${customerName}, תזכורת: הפגישה שלך ל${appointment.service_type} מחר ב-${appointment.start_time}. אנחנו מצפים לראותך!`;
          break;
        case 'reminder_3h':
          message = `שלום ${customerName}, תזכורת: הפגישה שלך ל${appointment.service_type} היום ב-${appointment.start_time} (בעוד כ-3 שעות). נשמח לראותך!`;
          break;
        case 'cancellation':
          message = `שלום ${customerName}, הפגישה שלך ל${appointment.service_type} ב-${dateStr} בשעה ${appointment.start_time} בוטלה בהצלחה.`;
          break;
        case 'waiting_list':
          // This case is handled directly with custom message
          break;
        default:
          message = `שלום ${customerName}, הודעה בנוגע לפגישה שלך ל${appointment.service_type} ב-${dateStr} בשעה ${appointment.start_time}.`;
      }
    }

    // Log the message that would be sent (for demo purposes)
    console.log(`DEMO: Sending ${notificationType} message to ${customerPhoneNumber}: ${message}`);

    // Update appointment notification status
    if (!adminNotification && notificationType !== 'waiting_list' && notificationType !== 'custom') {
      await supabase
        .from('appointments')
        .update({
          whatsapp_notification_sent: true,
          notification_sent_at: new Date().toISOString()
        })
        .eq('id', appointmentId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        method: 'whatsapp',
        whatsappStatus: 'sent',
        smsStatus: 'not_attempted'
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error('Error in whatsapp-notification function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        whatsappStatus: 'failed',
        smsStatus: 'not_attempted'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
