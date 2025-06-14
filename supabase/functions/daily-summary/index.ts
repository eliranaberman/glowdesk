
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Daily summary function called');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    
    console.log('Generating daily summary for:', todayDate);

    // Get today's appointments
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
      .eq('date', todayDate)
      .in('status', ['completed', 'cancelled']);

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    // Get today's expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .eq('date', todayDate);

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
      throw expensesError;
    }

    // Get today's revenues
    const { data: revenues, error: revenuesError } = await supabase
      .from('revenues')
      .select('*')
      .eq('date', todayDate);

    if (revenuesError) {
      console.error('Error fetching revenues:', revenuesError);
      throw revenuesError;
    }

    const completedAppointments = appointments?.filter(app => app.status === 'completed') || [];
    const cancelledAppointments = appointments?.filter(app => app.status === 'cancelled') || [];
    const totalRevenue = revenues?.reduce((sum, rev) => sum + Number(rev.amount), 0) || 0;
    const totalExpenses = expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;
    const netProfit = totalRevenue - totalExpenses;

    // Create summary message
    const summaryMessage = `סיכום יומי ל-${todayDate}:

📅 פגישות:
✅ הושלמו: ${completedAppointments.length}
❌ בוטלו: ${cancelledAppointments.length}

💰 כספים:
📈 הכנסות: ₪${totalRevenue}
📉 הוצאות: ₪${totalExpenses}
💵 רווח נטו: ₪${netProfit}

${completedAppointments.length > 0 ? `\n👥 לקוחות שטופלו:\n${completedAppointments.map(app => `• ${app.customers?.full_name} - ${app.service_type}`).join('\n')}` : ''}

${expenses && expenses.length > 0 ? `\n🧾 הוצאות:\n${expenses.map(exp => `• ${exp.category}: ₪${exp.amount}`).join('\n')}` : ''}

זכרי להזין את כל ההוצאות מהיום!`;

    // Get all users with daily summary enabled
    const { data: users, error: usersError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('daily_summary_enabled', true);

    if (usersError) {
      console.error('Error fetching users with daily summary enabled:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} users with daily summary enabled`);

    const results = [];

    for (const userPref of users || []) {
      try {
        // Log the notification
        await supabase
          .from('notification_logs')
          .insert({
            user_id: userPref.user_id,
            notification_type: 'daily_summary',
            channel: userPref.whatsapp_enabled ? 'whatsapp' : 
                    userPref.email_enabled ? 'email' : 'dashboard',
            status: 'sent',
            message_content: summaryMessage,
            sent_at: new Date().toISOString()
          });

        results.push({
          userId: userPref.user_id,
          status: 'sent'
        });

        console.log(`Daily summary sent to user ${userPref.user_id}`);

      } catch (error) {
        console.error(`Error sending daily summary to user ${userPref.user_id}:`, error);
        results.push({
          userId: userPref.user_id,
          status: 'failed',
          error: error.message
        });
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Daily summary processing completed',
        summary: {
          date: todayDate,
          completedAppointments: completedAppointments.length,
          cancelledAppointments: cancelledAppointments.length,
          totalRevenue,
          totalExpenses,
          netProfit
        },
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Daily summary error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process daily summary'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
