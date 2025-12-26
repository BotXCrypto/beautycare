import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phone, fullName } = await req.json();

    if (!phone || !fullName) {
      return new Response(
        JSON.stringify({ error: "Phone and fullName are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP in a temporary table or use a function
    const { error: insertError } = await supabase
      .from("phone_otp")
      .upsert(
        {
          phone,
          otp,
          full_name: fullName,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
        },
        { onConflict: "phone" }
      );

    if (insertError) throw insertError;

    // In production, you would send this via SMS using a service like Twilio
    // For now, we'll log it (in production, remove this log)
    console.log(`OTP for ${phone}: ${otp}`);

    // Send SMS (using Twilio or similar service)
    // This is a placeholder - implement with your SMS provider
    // const twilioResponse = await fetch("https://api.twilio.com/...", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //     Authorization: `Basic ${btoa(
    //       `${Deno.env.get("TWILIO_ACCOUNT_SID")}:${Deno.env.get("TWILIO_AUTH_TOKEN")}`
    //     )}`,
    //   },
    //   body: new URLSearchParams({
    //     To: phone,
    //     From: Deno.env.get("TWILIO_PHONE_NUMBER") || "",
    //     Body: `Your Pure & Peak verification code is: ${otp}. Valid for 10 minutes.`,
    //   }),
    // });

    return new Response(
      JSON.stringify({
        success: true,
        message: "OTP sent successfully",
        // In development only - remove in production
        ...(Deno.env.get("ENVIRONMENT") === "development" && { otp }),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
