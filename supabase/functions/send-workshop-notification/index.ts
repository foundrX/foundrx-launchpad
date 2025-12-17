import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WorkshopNotificationRequest {
  userEmail: string;
  userName: string;
  workshopTitle: string;
  workshopDate: string;
  hostName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, workshopTitle, workshopDate, hostName }: WorkshopNotificationRequest = await req.json();

    console.log("Sending workshop notification to:", userEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "FoundrX <onboarding@resend.dev>",
        to: [userEmail],
        subject: `You're registered for "${workshopTitle}"!`,
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
              .workshop-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Registration Confirmed!</h1>
              </div>
              <div class="content">
                <p>Hi ${userName || 'there'},</p>
                <p>Great news! You're all set for the upcoming workshop:</p>
                <div class="workshop-card">
                  <h2 style="margin-top: 0; color: #3b82f6;">${workshopTitle}</h2>
                  <p><strong>📅 Date:</strong> ${workshopDate}</p>
                  <p><strong>👤 Host:</strong> ${hostName}</p>
                </div>
                <p>We're excited to have you join us! Make sure to mark your calendar and come prepared to learn.</p>
                <p>See you there!</p>
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
    console.log("Workshop notification sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending workshop notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
