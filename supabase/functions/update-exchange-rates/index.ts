import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch exchange rates from free API (exchangerate-api.io)
    // Base currency is PKR
    const response = await fetch('https://open.er-api.com/v6/latest/PKR');
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();
    console.log('Fetched exchange rates:', data);

    // Update exchange rates in database
    const currencies = ['USD', 'EUR', 'GBP', 'AED', 'SAR', 'INR'];
    
    for (const currency of currencies) {
      if (data.rates[currency]) {
        // PKR to other currency
        await supabase
          .from('exchange_rates')
          .upsert({
            from_currency: 'PKR',
            to_currency: currency,
            rate: data.rates[currency],
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'from_currency,to_currency'
          });

        // Other currency to PKR (inverse rate)
        await supabase
          .from('exchange_rates')
          .upsert({
            from_currency: currency,
            to_currency: 'PKR',
            rate: 1 / data.rates[currency],
            updated_at: new Date().toISOString(),
          }, {
            onConflict: 'from_currency,to_currency'
          });
      }
    }

    // PKR to PKR rate
    await supabase
      .from('exchange_rates')
      .upsert({
        from_currency: 'PKR',
        to_currency: 'PKR',
        rate: 1,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'from_currency,to_currency'
      });

    console.log('Exchange rates updated successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Exchange rates updated successfully',
        rates: data.rates 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error updating exchange rates:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
