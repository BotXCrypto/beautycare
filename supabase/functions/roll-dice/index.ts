import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log('Dice Roll function loaded');

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // 1. Check if the feature is enabled in admin_settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('admin_settings')
      .select('value')
      .in('key', ['dice_discount_enabled', 'dice_reward_map', 'dice_max_discount_percentage']);
      
    if (settingsError) throw settingsError;

    const isEnabled = settings.find(s => s.key === 'dice_discount_enabled')?.value;
    const rewardMap = settings.find(s => s.key === 'dice_reward_map')?.value;
    
    if (!isEnabled) {
      return new Response(JSON.stringify({ error: 'Dice roll feature is disabled.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }
    if (!rewardMap) {
        return new Response(JSON.stringify({ error: 'Dice reward map is not configured.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    // 2. Check for recent, un-used rolls to prevent abuse
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentRolls, error: recentRollsError } = await supabaseClient
      .from('dice_roll_attempts')
      .select('*')
      .eq('user_id', user.id)
      .is('applied_to_order_id', null)
      .gte('created_at', fifteenMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentRollsError) throw recentRollsError;

    if (recentRolls && recentRolls.length > 0) {
      const latestRoll = recentRolls[0];
      // Return the existing roll instead of creating a new one
      return new Response(JSON.stringify({
        diceTotal: latestRoll.dice_total,
        reward: {
          type: latestRoll.reward_type,
          value: latestRoll.reward_value,
          label: latestRoll.reward_label,
        },
        message: 'You have a recent roll pending.',
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // 3. Generate a new roll
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;

    const reward = rewardMap[total.toString()];
    if (!reward) {
      return new Response(JSON.stringify({ error: `No reward configured for dice total: ${total}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // 4. Save the new roll attempt to the database
    const { data: newRoll, error: insertError } = await supabaseClient
      .from('dice_roll_attempts')
      .insert({
        user_id: user.id,
        dice_total: total,
        reward_type: reward.type,
        reward_value: reward.value,
        reward_label: reward.label,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // 5. Return the result
    const responsePayload = {
      diceTotal: total,
      reward: {
        type: reward.type,
        value: reward.value,
        label: reward.label,
      },
    };

    return new Response(JSON.stringify(responsePayload), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in Dice Roll function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
