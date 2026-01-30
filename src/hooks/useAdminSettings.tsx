import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAdminSettings(keys: string[]) {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Use type assertion to bypass TypeScript check for table that may not exist yet
        const { data, error } = await (supabase as any)
          .from('admin_settings')
          .select('key, value')
          .in('key', keys);

        if (error) {
          // Table might not exist - return defaults
          console.debug('Admin settings not available:', error.message);
          setSettings({});
          return;
        }

        const settingsArray = (data || []) as Array<{ key: string; value: any }>;
        const settingsMap = settingsArray.reduce((acc, setting) => {
          acc[setting.key] = setting.value;
          return acc;
        }, {} as any);
        
        setSettings(settingsMap);
      } catch (error: any) {
        console.error('Error fetching admin settings:', error);
        setSettings({});
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [JSON.stringify(keys)]);

  return { settings, loading };
}
