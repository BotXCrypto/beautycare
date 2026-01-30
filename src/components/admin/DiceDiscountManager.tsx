import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

type RewardMap = {
  [key: string]: { type: string; value: number | null; label: string };
};

const DEFAULT_REWARD_MAP: RewardMap = {
    '2': { type: 'free_shipping', value: 0, label: 'Free Shipping' },
    '3': { type: 'free_shipping', value: 0, label: 'Free Shipping' },
    '4': { type: 'free_shipping', value: 0, label: 'Free Shipping' },
    '5': { type: 'percentage', value: 5, label: '5% Discount' },
    '6': { type: 'percentage', value: 5, label: '5% Discount' },
    '7': { type: 'percentage', value: 7, label: '7% Discount' },
    '8': { type: 'percentage', value: 7, label: '7% Discount' },
    '9': { type: 'percentage', value: 10, label: '10% Discount' },
    '10': { type: 'percentage', value: 10, label: '10% Discount' },
    '11': { type: 'free_gift', value: null, label: 'Free Gift' },
    '12': { type: 'percentage', value: 12, label: '12% Discount' },
};

export const DiceDiscountManager = () => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [maxDiscount, setMaxDiscount] = useState<number>(15);
  const [allowedPages, setAllowedPages] = useState<string>('cart');
  const [rewardMap, setRewardMap] = useState<RewardMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      // Use type assertion to bypass TypeScript check for table that may not exist
      const { data, error } = await (supabase as any).from('admin_settings').select('key, value');
      
      if (error) {
        console.debug('Admin settings not available:', error.message);
        // Use defaults if table doesn't exist
        setRewardMap(DEFAULT_REWARD_MAP);
      } else if (data) {
        const settingsArray = (data || []) as Array<{ key: string; value: any }>;
        const settings: { [key: string]: any } = settingsArray.reduce((acc, item) => {
          acc[item.key] = item.value;
          return acc;
        }, {} as { [key: string]: any });

        setEnabled(settings.dice_discount_enabled ?? false);
        setMaxDiscount(settings.dice_max_discount_percentage ?? 15);
        setAllowedPages((settings.dice_allowed_pages ?? ['cart']).join(', '));
        setRewardMap(settings.dice_reward_map ?? DEFAULT_REWARD_MAP);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    const updates = [
      { key: 'dice_discount_enabled', value: enabled },
      { key: 'dice_max_discount_percentage', value: maxDiscount },
      { key: 'dice_allowed_pages', value: allowedPages.split(',').map(p => p.trim()) },
      { key: 'dice_reward_map', value: rewardMap },
    ];

    // Use type assertion to bypass TypeScript check
    const promises = updates.map(update => 
      (supabase as any).from('admin_settings').update({ value: update.value }).eq('key', update.key)
    );
    
    const results = await Promise.all(promises);
    const someError = results.some((res: any) => res.error);

    if (someError) {
      toast({ title: 'Error saving settings', description: 'One or more settings failed to save.', variant: 'destructive' });
      console.error('Settings save errors:', results.map(r => r.error).filter(Boolean));
    } else {
      toast({ title: 'Settings saved!', description: 'Dice discount settings have been updated.' });
    }
    setSaving(false);
  };

  const handleRewardMapChange = (diceTotal: string, field: 'type' | 'value' | 'label', newValue: any) => {
    setRewardMap(prev => ({
      ...prev,
      [diceTotal]: {
        ...prev[diceTotal as keyof RewardMap],
        [field]: newValue,
      },
    }));
  };

  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="space-y-2 pt-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-48 w-full" />
                </div>
                <Skeleton className="h-10 w-24" />
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>3D Dice Roll Discount</CardTitle>
        <CardDescription>Configure the gamified dice roll discount feature for your store.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="dice-discount-enabled" className="font-medium">
              Enable Dice Discount System
            </Label>
            <Switch
              id="dice-discount-enabled"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-discount">Max Discount Percentage</Label>
            <Input
              id="max-discount"
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
              placeholder="e.g., 15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowed-pages">Allowed Pages (comma-separated)</Label>
            <Input
              id="allowed-pages"
              value={allowedPages}
              onChange={(e) => setAllowedPages(e.target.value)}
              placeholder="e.g., cart, checkout"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Reward Mapping</h3>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dice Total</TableHead>
                  <TableHead>Reward Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Label</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(rewardMap).map(([total, reward]) => (
                  <TableRow key={total}>
                    <TableCell className="font-medium">{total}</TableCell>
                    <TableCell>
                      <Input
                        value={reward.type}
                        onChange={(e) => handleRewardMapChange(total, 'type', e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={reward.value ?? ''}
                        onChange={(e) => handleRewardMapChange(total, 'value', e.target.value ? Number(e.target.value) : null)}
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={reward.label}
                        onChange={(e) => handleRewardMapChange(total, 'label', e.target.value)}
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};