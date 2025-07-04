import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Function to format phone number for WhatsApp
function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with 972
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '972' + cleanPhone.substring(1);
  }
  
  // If doesn't start with country code, add 972
  if (!cleanPhone.startsWith('972')) {
    cleanPhone = '972' + cleanPhone;
  }
  
  return cleanPhone;
}

// Function to replace template variables
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value || '');
  }
  return result;
}

serve(async (req) => {
  console.log('Multi-tenant appointment reminders function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get tomorrow's date (24 hours from now)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];

    console.log('Looking for appointments on:', tomorrowDate);

    // Get all appointments for tomorrow that haven't had reminders sent
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select(`
        *,
        customers:customer_id (
          id,
          full_name,
          email,
          phone_number
        )
      `)
      .eq('date', tomorrowDate)
      .eq('status', 'scheduled')
      .is('reminder_sent_at', null);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    console.log(`Found ${appointments?.length || 0} appointments needing reminders`);

    if (!appointments || appointments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No appointments found for reminders' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];

    // Group appointments by user_id for efficient processing
    const appointmentsByUser = appointments.reduce((acc, appointment) => {
      const userId = appointment.user_id;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(appointment);
      return acc;
    }, {} as Record<string, any[]>);

    for (const [userId, userAppointments] of Object.entries(appointmentsByUser)) {
      try {
        // Get user's WhatsApp settings
        const { data: whatsappSettings } = await supabase
          .from('user_whatsapp_settings')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (!whatsappSettings?.auto_reminders_enabled) {
          console.log(`Auto reminders disabled for user ${userId}`);
          continue;
        }

        // Get user's default reminder template
        const { data: template } = await supabase
          .from('message_templates')
          .select('*')
          .eq('user_id', userId)
          .eq('template_type', 'reminder')
          .eq('is_default', true)
          .single();

        const defaultTemplate = template?.content || `שלום {customer_name}! 👋
תזכורת לתור שלך מחר ({date}) בשעה {time}
שירות: {service}
כתובת: {address}
לאישור התור השב "כן" 
לביטול השב "ביטול"
תודה! 💅`;

        // Process each appointment for this user
        for (const appointment of userAppointments) {
          try {
            const customer = appointment.customers;
            
            if (!customer?.phone_number) {
              console.log(`No phone number for appointment ${appointment.id}`);
              continue;
            }

            const formattedPhone = formatPhoneForWhatsApp(customer.phone_number);
            if (!formattedPhone) {
              console.log(`Invalid phone number for appointment ${appointment.id}`);
              continue;
            }

            // Create personalized message
            const messageVariables = {
              customer_name: customer.full_name || 'לקוח',
              date: appointment.date,
              time: appointment.start_time,
              service: appointment.service_type,
              address: whatsappSettings?.business_address || '',
              business_name: whatsappSettings?.business_name || ''
            };

            const personalizedMessage = replaceTemplateVariables(defaultTemplate, messageVariables);

            // Log the notification attempt
            await supabase
              .from('notification_logs')
              .insert({
                user_id: userId,
                appointment_id: appointment.id,
                notification_type: 'reminder',
                channel: 'whatsapp',
                phone_number: formattedPhone,
                message_content: personalizedMessage,
                status: 'sent',
                sent_at: new Date().toISOString()
              });

            // Update appointment to mark reminder as sent
            await supabase
              .from('appointments')
              .update({ 
                reminder_sent_at: new Date().toISOString(),
                confirmation_status: 'pending'
              })
              .eq('id', appointment.id);

            results.push({
              appointmentId: appointment.id,
              customerName: customer.full_name,
              userId: userId,
              phone: formattedPhone,
              status: 'sent'
            });

            console.log(`Reminder logged for appointment ${appointment.id}, user ${userId}`);

          } catch (error) {
            console.error(`Error processing appointment ${appointment.id}:`, error);
            
            // Log the error
            await supabase
              .from('notification_logs')
              .insert({
                user_id: userId,
                appointment_id: appointment.id,
                notification_type: 'reminder',
                channel: 'whatsapp',
                message_content: 'Failed to send',
                status: 'failed',
                error_message: error.message,
                sent_at: new Date().toISOString()
              });

            results.push({
              appointmentId: appointment.id,
              userId: userId,
              status: 'failed',
              error: error.message
            });
          }
        }

      } catch (error) {
        console.error(`Error processing user ${userId}:`, error);
        
        for (const appointment of userAppointments) {
          results.push({
            appointmentId: appointment.id,
            userId: userId,
            status: 'failed',
            error: `User processing error: ${error.message}`
          });
        }
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Multi-tenant reminder processing completed',
        totalProcessed: appointments.length,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Multi-tenant appointment reminders error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process multi-tenant appointment reminders'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
