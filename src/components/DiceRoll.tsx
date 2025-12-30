import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// This is a placeholder component.
// The 3D dice animation requires the 'three', '@react-three/fiber', 
// '@react-three/drei', and '@react-three/cannon' libraries.
// Please install them to enable the full feature.

interface DiceRollProps {
  onRollComplete: (reward: { type: string; value: number | null; label: string; diceTotal: number }) => void;
}

// Mock reward map
const MOCK_REWARD_MAP = {
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

const DiceRoll = ({ onRollComplete }: DiceRollProps) => {
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState(false);

  const handleRoll = async () => {
    setRolling(true);

    // TODO: This should call the 'roll-dice' Supabase edge function.
    // For now, we simulate a network delay and a random result.
    await new Promise(resolve => setTimeout(resolve, 1000));

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    
    const reward = MOCK_REWARD_MAP[total.toString() as keyof typeof MOCK_REWARD_MAP];

    toast({
      title: 'You rolled a ' + total + '!',
      description: `You won: ${reward.label}`,
    });

    onRollComplete({ ...reward, diceTotal: total });
    setRolling(false);
    setRolled(true);
  };

  return (
    <div className="p-6 border rounded-lg text-center bg-muted/20">
      <h3 className="text-xl font-bold mb-2">Feeling Lucky?</h3>
      <p className="text-muted-foreground mb-4">Roll the dice to get an exclusive discount on your order!</p>
      
      <div className="h-32 flex items-center justify-center bg-muted rounded-lg mb-4">
        <p className="text-sm text-muted-foreground">
          [ 3D Dice Animation will be shown here ]
        </p>
      </div>

      <Button
        onClick={handleRoll}
        disabled={rolling || rolled}
        variant="gradient"
        size="lg"
      >
        {rolling ? 'Rolling...' : (rolled ? 'Good Luck!' : 'Roll Dice to Get Discount')}
      </Button>
    </div>
  );
};

export default DiceRoll;
