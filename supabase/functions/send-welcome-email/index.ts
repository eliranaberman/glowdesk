import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  businessName: string;
  fullName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, businessName, fullName }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to: ${email}, Business: ${businessName}`);

    const loginLink = `${Deno.env.get('SUPABASE_URL')?.replace('/rest/v1', '') || 'https://njjxqxluxtyechxgtwsq.supabase.co'}/auth/v1/verify`;
    const guideLink = "https://docs.glowdesk.com/getting-started"; // placeholder

    const emailResponse = await resend.emails.send({
      from: "GlowDesk <welcome@glowdesk.com>",
      to: [email],
      subject: "ברוכה הבאה ל-GlowDesk!",
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(135deg, #EFCFD4, #FAD8C3); padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2C1810; margin: 0; font-size: 28px;">ברוכה הבאה ל-GlowDesk!</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; color: #2C1810; margin-bottom: 20px;">
              שלום ${businessName},
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 25px;">
              תודה שהצטרפת ל-GlowDesk – המערכת המובילה לניהול העסק שלך בקלות וביעילות!
            </p>
            
            <div style="background-color: #F5F0EB; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #2C1810; margin-top: 0;">פרטי הכניסה שלך:</h3>
              <p style="margin: 10px 0;"><strong>מייל:</strong> ${email}</p>
              <p style="margin: 10px 0;"><strong>לינק לכניסה:</strong> <a href="${loginLink}" style="color: #D8A08A;">לחץ כאן</a></p>
            </div>
            
            <div style="background-color: #FFE5D9; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #2C1810; margin-top: 0;">בכל שאלה או בעיה אנחנו כאן בשבילך:</h3>
              <p style="margin: 10px 0;">📞 <strong>טלפון לתמיכה:</strong> 03-XXXXXXX</p>
              <p style="margin: 10px 0;">📧 <strong>מייל לתמיכה:</strong> support@glowdesk.com</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${guideLink}" style="background: linear-gradient(135deg, #D8A08A, #EFCFD4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                להתחלה קלה – מדריך למשתמש
              </a>
            </div>
            
            <p style="color: #555; line-height: 1.6; text-align: center; margin-top: 30px;">
              בהצלחה,<br>
              <strong style="color: #2C1810;">צוות GlowDesk</strong>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #888; font-size: 12px;">
            <p>© 2024 GlowDesk. כל הזכויות שמורות.</p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);