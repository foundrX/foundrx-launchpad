import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ApplicationNotificationRequest {
  userEmail: string;
  userName: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, role }: ApplicationNotificationRequest = await req.json();

    console.log("Sending application notification to:", userEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "FoundrX <onboarding@resend.dev>",
        to: [userEmail],
        subject: "We received your FoundrX application!",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .highlight { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📝 Application Received!</h1>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Thank you for applying to join FoundrX as a <strong>${role}</strong>!</p>
                <div class="highlight">
                  <p style="margin: 0; font-size: 18px;">🎯 What's next?</p>
                </div>
                <p>Our team will review your application within <strong>48 hours</strong>. We'll get back to you with an update soon.</p>
                <p>In the meantime, feel free to explore our workshops and resources on the platform.</p>
                <p>Thank you for your interest in FoundrX!</p>
                <p>— The FoundrX Team</p>
              </div>
              <div class="footer">
                <p>Made by 8th graders who believe the next generation of innovators starts today.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const data = await res.json();
    console.log("Application notification sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending application notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
