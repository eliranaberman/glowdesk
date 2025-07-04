import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to normalize response text for matching
function normalizeResponse(text: string): string {
  return text.trim().toLowerCase().replace(/[^\u05D0-\u05EA\u0041-\u005A\u0061-\u007A]/g, '');
}

// Function to classify user response
function classifyResponse(text: string): 'confirmed' | 'cancelled' | 'unknown' {
  const normalized = normalizeResponse(text);
  
  // Hebrew confirmations
  const confirmations = ['כן', 'אישור', 'מאשר', 'מאשרת', 'בסדר', 'אוקיי', 'ok', 'yes'];
  const cancellations = ['לא', 'ביטול', 'מבטל', 'מבטלת', 'לבטל', 'cancel', 'no'];
  
  if (confirmations.some(word => normalized.includes(word))) {
    return 'confirmed';
  }
  
  if (cancellations.some(word => normalized.includes(word))) {
    return 'cancelled';
  }
  
  return 'unknown';
}

serve(async (req) => {
  console.log('WhatsApp responses webhook called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse webhook payload (format depends on WhatsApp Business API provider)
    const payload = await req.json();
    console.log('Received webhook payload:', JSON.stringify(payload, null, 2));

    // Extract message details (adjust based on your WhatsApp provider)
    const senderPhone = payload.from || payload.phone;
    const messageText = payload.text || payload.message || payload.body;
    const messageId = payload.id || payload.messageId;

    if (!senderPhone || !messageText) {
      console.log('Missing sender phone or message text');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone number for matching
    let normalizedPhone = senderPhone.replace(/\D/g, '');
    if (normalizedPhone.startsWith('972')) {
      normalizedPhone = '0' + normalizedPhone.substring(3);
    }

    console.log(`Processing response from ${normalizedPhone}: "${messageText}"`);

    // Find recent appointments for this phone number awaiting confirmation
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        *,
        customers:customer_id (
          id,
          full_name,
          phone_number
        )
      `)
      .eq('confirmation_status', 'pending')
      .gte('date', threeDaysAgo.toISOString().split('T')[0])
      .not('reminder_sent_at', 'is', null);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    // Find matching appointment by phone number
    const matchingAppointment = appointments?.find(apt => {
      const customerPhone = apt.customers?.phone_number;
      if (!customerPhone) return false;
      
      let customerNormalizedPhone = customerPhone.replace(/\D/g, '');
      if (customerNormalizedPhone.startsWith('972')) {
        customerNormalizedPhone = '0' + customerNormalizedPhone.substring(3);
      }
      
      return customerNormalizedPhone === normalizedPhone;
    });

    if (!matchingAppointment) {
      console.log(`No pending appointment found for phone ${normalizedPhone}`);
      
      // Log the unmatched response
      await supabase
        .from('notification_logs')
        .insert({
          user_id: '00000000-0000-0000-0000-000000000000', // Placeholder for unmatched
          notification_type: 'response',
          channel: 'whatsapp',
          phone_number: senderPhone,
          message_content: `Unmatched response: ${messageText}`,
          status: 'unmatched',
          external_message_id: messageId,
          received_at: new Date().toISOString()
        });

      return new Response(
        JSON.stringify({ message: 'No matching appointment found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Classify the response
    const responseType = classifyResponse(messageText);
    const now = new Date().toISOString();

    let confirmationStatus: string;
    let responseMessage: string;
    
    // Get user's WhatsApp settings for response message
    const { data: whatsappSettings } = await supabase
      .from('user_whatsapp_settings')
      .select('*')
      .eq('user_id', matchingAppointment.user_id)
      .single();

    const businessName = whatsappSettings?.business_name || 'העסק';

    switch (responseType) {
      case 'confirmed':
        confirmationStatus = 'confirmed';
        responseMessage = `תודה ${matchingAppointment.customers?.full_name}! ✅
התור שלך ב-${matchingAppointment.date} בשעה ${matchingAppointment.start_time} אושר בהצלחה.
נתראה בקרוב! 💅
${businessName}`;
        break;
        
      case 'cancelled':
        confirmationStatus = 'cancelled';
        responseMessage = `שלום ${matchingAppointment.customers?.full_name},
התור שלך ב-${matchingAppointment.date} בשעה ${matchingAppointment.start_time} בוטל בהצלחה. ❌
לקביעת תור חדש אנא צרי איתנו קשר.
תודה על ההבנה! 🙏
${businessName}`;
        break;
        
      default:
        confirmationStatus = 'pending';
        responseMessage = `שלום ${matchingAppointment.customers?.full_name},
לא הבנתי את התשובה שלך. 🤔
אנא השיבי:
• "כן" או "אישור" - לאישור התור
• "לא" או "ביטול" - לביטול התור
תודה! 
${businessName}`;
    }

    // Update appointment status
    const { error: updateError } = await supabase
      .from('appointments')
      .update({
        confirmation_status: confirmationStatus,
        confirmed_at: responseType === 'confirmed' ? now : null,
        confirmation_response: messageText,
        ...(responseType === 'cancelled' && { 
          status: 'cancelled',
          cancelled_at: now,
          cancel_reason: 'Customer cancelled via WhatsApp'
        })
      })
      .eq('id', matchingAppointment.id);

    if (updateError) {
      console.error('Error updating appointment:', updateError);
      throw updateError;
    }

    // Log the response and our reply
    await supabase
      .from('notification_logs')
      .insert([
        {
          user_id: matchingAppointment.user_id,
          appointment_id: matchingAppointment.id,
          notification_type: 'response',
          channel: 'whatsapp',
          phone_number: senderPhone,
          message_content: messageText,
          status: 'received',
          external_message_id: messageId,
          received_at: now
        },
        {
          user_id: matchingAppointment.user_id,
          appointment_id: matchingAppointment.id,
          notification_type: 'auto_response',
          channel: 'whatsapp',
          phone_number: senderPhone,
          message_content: responseMessage,
          status: 'sent',
          sent_at: now
        }
      ]);

    console.log(`Processed ${responseType} response for appointment ${matchingAppointment.id}`);

    // Return response for WhatsApp provider to send back
    return new Response(
      JSON.stringify({
        success: true,
        appointmentId: matchingAppointment.id,
        responseType,
        confirmationStatus,
        reply: responseMessage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('WhatsApp responses webhook error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process WhatsApp response'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});