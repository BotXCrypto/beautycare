// DEPRECATED: Phone OTP verification removed. This function is kept for reference
// and now returns HTTP 410 Gone for all requests.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({ error: 'Phone OTP verification removed. Use email signup and collect phone at checkout.' }),
    {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
