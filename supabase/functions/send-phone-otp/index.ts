// DEPRECATED: Phone OTP signup removed. This function is kept only for reference and
// should not be used. It now returns HTTP 410 Gone for all requests.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(() => {
  return new Response(
    JSON.stringify({ error: 'Phone OTP flow removed. Use email signup and collect phone at checkout.' }),
    {
      status: 410,
      headers: { 'Content-Type': 'application/json' },
    }
  );
});
