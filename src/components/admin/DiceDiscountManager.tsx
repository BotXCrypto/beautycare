import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

// Mock data since DB is not yet migrated
const MOCK_SETTINGS = {
  dice_discount_enabled: false,
  dice_max_discount_percentage: 15,
  dice_allowed_pages: ['cart', 'checkout'],
  dice_reward_map: {
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
  },
};

type RewardMap = typeof MOCK_SETTINGS.dice_reward_map;

export const DiceDiscountManager = () => {
  const [enabled, setEnabled] = useState(MOCK_SETTINGS.dice_discount_enabled);
  const [maxDiscount, setMaxDiscount] = useState(MOCK_SETTINGS.dice_max_discount_percentage);
  const [allowedPages, setAllowedPages] = useState(MOCK_SETTINGS.dice_allowed_pages.join(', '));
  const [rewardMap, setRewardMap] = useState<RewardMap>(MOCK_SETTINGS.dice_reward_map);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual data fetching when DB is ready
  // useEffect(() => {
  //   const fetchSettings = async () => {
  //     setLoading(true);
  //     const { data, error } = await supabase.from('admin_settings').select('key, value');
  //     if (error) {
  //       toast({ title: 'Error fetching settings', description: error.message, variant: 'destructive' });
  //     } else {
  //       // Process data into state
  //     }
  //     setLoading(false);
  //   };
  //   fetchSettings();
  // }, []);

  const handleSave = async () => {
    setLoading(true);
    toast({
      title: 'Saving settings...',
      description: 'This is a mock-up. No data will be saved.',
    });
    // TODO: Replace with actual data saving when DB is ready
    // const updates = [
    //   { key: 'dice_discount_enabled', value: enabled },
    //   { key: 'dice_max_discount_percentage', value: maxDiscount },
    //   { key: 'dice_allowed_pages', value: allowedPages.split(',').map(p => p.trim()) },
    //   { key: 'dice_reward_map', value: rewardMap },
    // ];
    // const { error } = await supabase.from('admin_settings').upsert(updates);
    // if (error) {
    //   toast({ title: 'Error saving settings', description: error.message, variant: 'destructive' });
    // } else {
    //   toast({ title: 'Settings saved!', description: 'Dice discount settings have been updated.' });
    // }
    setTimeout(() => {
      setLoading(false);
      toast({ title: 'Mock-up complete', description: 'Settings were not saved.' });
    }, 1000);
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

        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};
