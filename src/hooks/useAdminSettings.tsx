import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminSettings(keys: string[]) {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('key, value')
          .in('key', keys);

        if (error) throw error;

        const settingsMap = data.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as any);
        
        setSettings(settingsMap);
      } catch (error: any) {
        console.error('Error fetching admin settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [JSON.stringify(keys)]);

  return { settings, loading };
}
