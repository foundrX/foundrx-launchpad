import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userEmail: string;
  userName: string;
  role: string;
}

const roleLabels: Record<string, string> = {
  student_founder: "Student Founder",
  mentor: "Mentor",
  investor: "Investor",
  small_business: "Small Business Owner",
  chartered_accountant: "Chartered Accountant",
  lawyer: "Lawyer",
  admin_team: "Administrative Team",
  freelancer: "Freelancer",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, role }: WelcomeEmailRequest = await req.json();
    const roleLabel = roleLabels[role] || role;

    console.log("Sending welcome email to:", userEmail);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "FoundrX <onboarding@resend.dev>",
        to: [userEmail],
        subject: "Welcome to FoundrX! 🚀",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center; }
              .header h1 { color: white; margin: 0; font-size: 28px; }
              .header p { color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
              .highlight { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
              .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: white; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: 600; margin: 20px 0; }
              .features { margin: 20px 0; }
              .feature { display: flex; align-items: center; margin: 12px 0; }
              .feature-icon { width: 24px; height: 24px; margin-right: 12px; color: #3b82f6; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to FoundrX! 🚀</h1>
                <p>Your journey to innovation starts now</p>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Congratulations on joining FoundrX as a <strong>${roleLabel}</strong>! We're thrilled to have you as part of our community.</p>
                
                <div class="highlight">
                  <p style="margin: 0; font-size: 16px;">💡 <strong>What is FoundrX?</strong></p>
                  <p style="margin: 10px 0 0 0;">FoundrX is a student-led platform created by 8th graders passionate about innovation and entrepreneurship. We believe that ideas have no age limit!</p>
                </div>
                
                <p><strong>Here's what you can do next:</strong></p>
                <div class="features">
                  <div class="feature">✅ Explore upcoming workshops and events</div>
                  <div class="feature">✅ Connect with mentors and fellow entrepreneurs</div>
                  <div class="feature">✅ Apply for exclusive programs</div>
                  <div class="feature">✅ Access resources to grow your skills</div>
                </div>
                
                <center>
                  <a href="${Deno.env.get("SITE_URL") || "https://foundrx.lovable.app"}" class="cta-button">Explore FoundrX</a>
                </center>
                
                <p>If you have any questions, feel free to reach out. We're here to help!</p>
                <p>Welcome aboard! 🎉</p>
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
    console.log("Welcome email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
