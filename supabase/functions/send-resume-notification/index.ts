
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "azimjona2022@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing resume notification request");
    const { application } = await req.json();
    
    if (!application) {
      console.error("Missing required application data");
      return new Response(
        JSON.stringify({ error: "Missing required application data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { full_name, email, phone, vacancy_title, vacancy_id, cover_letter, attachments = [] } = application;
    
    console.log("Application data received:", {
      full_name,
      email,
      vacancy_title,
      vacancy_id,
      attachmentsCount: attachments.length
    });

    // Create HTML content for email
    let attachmentsHtml = "";
    if (attachments && attachments.length > 0) {
      attachmentsHtml = `
        <p style="margin-top: 16px;">
          <strong>Attached files:</strong>
        </p>
        <ul>
          ${attachments.map(url => `
            <li>
              <a href="${url}" target="_blank" style="color: #3182ce;">${url.split('/').pop()}</a>
            </li>
          `).join('')}
        </ul>
      `;
    }
    
    // Add cover letter to email if provided
    let coverLetterHtml = "";
    if (cover_letter) {
      coverLetterHtml = `
        <p style="margin-top: 16px;">
          <strong>Сопроводительное письмо:</strong>
        </p>
        <div style="background-color: #f8f9fa; padding: 12px; border-radius: 4px; margin-top: 8px;">
          ${cover_letter.replace(/\n/g, '<br>')}
        </div>
      `;
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2d3748; margin-bottom: 24px;">New Job Application</h2>
        <p>You have received a new application for the position: <strong>${vacancy_title || "Unnamed position"}</strong></p>
        <p>Application details:</p>
        <ul>
          <li><strong>Name:</strong> ${full_name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "Not provided"}</li>
          <li><strong>Position ID:</strong> ${vacancy_id}</li>
        </ul>
        ${coverLetterHtml}
        ${attachmentsHtml}
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p>You can view and manage all applications in your <a href="https://tower-up.com/admin/vacancy-applications" style="color: #3182ce;">admin panel</a>.</p>
        </div>
      </div>
    `;

    console.log("Sending email to:", ADMIN_EMAIL);

    // Send email notification
    const emailResponse = await resend.emails.send({
      from: "TowerUp Resumes <onboarding@resend.dev>",
      to: ADMIN_EMAIL,
      subject: `New Job Application: ${vacancy_title || "Unnamed position"}`,
      html: htmlContent,
      reply_to: email
    });

    console.log("Email notification sent:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Email notification sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending email notification:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
