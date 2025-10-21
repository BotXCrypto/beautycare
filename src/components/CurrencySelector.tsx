import { useCurrency } from '@/hooks/useCurrency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const CurrencySelector = () => {
  const { currentCurrency, currencies, changeCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={currentCurrency} onValueChange={changeCurrency}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;