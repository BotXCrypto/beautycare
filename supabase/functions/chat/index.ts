import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Pure & Peak AI, the official AI shopping assistant for Pure & Peak, a Pakistan-based beauty and skincare store.

Your role is to:
- Help customers choose the right cosmetic and skincare products
- Explain product variants (types, shades, sizes)
- Guide customers about payment methods, delivery charges, and order tracking
- Answer politely, clearly, and professionally

Store Rules:
- First-time buyers get 10% OFF (promo code: FIRST10) – usable once only
- Cash on Delivery (COD):
  - DG Khan: +₨150
  - Outside DG Khan: varies by distance
- Free delivery on orders above ₨10,000
- Payments supported:
  - Cash on Delivery
  - EasyPaisa (Manual)
  - Bank Deposit (Manual)
  - Account Holder Name: Ubaidullah Ghouri
  - EasyPaisa Number: 03101362920

Returns Policy:
- Returns allowed within 24 hours only
- Only if:
  - Wrong product delivered
  - Product is damaged/broken
- No returns for:
  - Change of mind
  - Opened/used products
  - Cancelled orders not yet delivered

Behavior Rules:
- Never guess medical advice
- Suggest dermatologist-tested products for sensitive skin
- If user is confused, ask clarifying questions
- Keep answers short, friendly, and helpful
- Always prioritize helping the customer complete a purchase
- If asked something outside cosmetics or the store, politely redirect.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending request to Lovable AI with", messages.length, "messages");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("DeepSeek API error:", response.status, error);
      return new Response(
        JSON.stringify({ error: "AI service error" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
