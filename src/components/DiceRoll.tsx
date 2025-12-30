import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface DiceRollProps {
  onRollComplete: (reward: { type: string; value: number | null; label: string; diceTotal: number }) => void;
}

// Mock reward map from parent - can be removed if/when passed as prop
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

const DieFace = ({ value }: { value: number }) => (
  <div className={`die-face face-${value}`}>
    {[...Array(value)].map((_, i) => <span key={i} className="dot"></span>)}
  </div>
);

const DiceRoll = ({ onRollComplete }: DiceRollProps) => {
  const [rolling, setRolling] = useState(false);
  const [rolled, setRolled] = useState(false);
  const [diceValues, setDiceValues] = useState({ die1: 1, die2: 1 });

  const handleRoll = async () => {
    setRolling(true);

    // TODO: This should call the 'roll-dice' Supabase edge function.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Animation duration

    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    const total = die1 + die2;
    
    setDiceValues({ die1, die2 });
    
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
      
      <div className="dice-container">
        <div className={`die ${rolling ? 'rolling' : ''}`}>
          <DieFace value={diceValues.die1} />
        </div>
        <div className={`die ${rolling ? 'rolling' : ''}`}>
          <DieFace value={diceValues.die2} />
        </div>
      </div>

      <Button
        onClick={handleRoll}
        disabled={rolling || rolled}
        variant="gradient"
        size="lg"
        className="mt-4"
      >
        {rolling ? 'Rolling...' : (rolled ? 'Good Luck!' : 'Roll Dice to Get Discount')}
      </Button>
    </div>
  );
};

export default DiceRoll;