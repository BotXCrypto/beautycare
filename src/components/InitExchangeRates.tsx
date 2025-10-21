import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const InitExchangeRates = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initRates = async () => {
      // Check if rates already exist
      const { data: existing } = await supabase
        .from('exchange_rates')
        .select('id')
        .limit(1);

      if (!existing || existing.length === 0) {
        // Call edge function to initialize rates
        try {
          await supabase.functions.invoke('update-exchange-rates');
          setInitialized(true);
        } catch (error) {
          console.error('Error initializing exchange rates:', error);
        }
      } else {
        setInitialized(true);
      }
    };

    if (!initialized) {
      initRates();
    }
  }, [initialized]);

  return null;
};

export default InitExchangeRates;