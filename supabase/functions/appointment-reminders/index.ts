
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
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

    // Process upcoming appointments for today and tomorrow
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id, 
        date, 
        start_time,
        service_type,
        reminder_24h_sent,
        reminder_3h_sent,
        whatsapp_notification_sent,
        sms_notification_sent,
        status,
        customers:customer_id (id, full_name, email, phone_number)
      `)
      .gte('date', todayDate)
      .lte('date', new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .in('status', ['scheduled'])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      throw error;
    }

    const processed = {
      reminder24h: 0,
      reminder3h: 0,
      errors: 0,
    };

    // Process each appointment
    for (const appointment of appointments || []) {
      try {
        // Calculate appointment datetime
        const appointmentDate = new Date(`${appointment.date}T${appointment.start_time}`);
        const hoursDifference = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Process 24h reminders (between 23-25 hours before)
        if (!appointment.reminder_24h_sent && hoursDifference >= 23 && hoursDifference <= 25) {
          await supabase.functions.invoke('whatsapp-notification', {
            body: {
              appointmentId: appointment.id,
              notificationType: 'reminder_24h'
            }
          });

          await supabase
            .from('appointments')
            .update({ reminder_24h_sent: true })
            .eq('id', appointment.id);

          processed.reminder24h++;
        }

        // Process 3h reminders (between 2.5-3.5 hours before)
        if (!appointment.reminder_3h_sent && hoursDifference >= 2.5 && hoursDifference <= 3.5) {
          await supabase.functions.invoke('whatsapp-notification', {
            body: {
              appointmentId: appointment.id,
              notificationType: 'reminder_3h'
            }
          });

          await supabase
            .from('appointments')
            .update({ reminder_3h_sent: true })
            .eq('id', appointment.id);

          processed.reminder3h++;
        }
      } catch (appointmentError) {
        console.error(`Error processing appointment ${appointment.id}:`, appointmentError);
        processed.errors++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        message: `Processed ${appointments?.length || 0} appointments`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing reminders:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
