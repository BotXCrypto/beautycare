import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface CurrencyContextType {
  currentCurrency: string;
  currencySymbol: string;
  currencies: Currency[];
  changeCurrency: (code: string) => Promise<void>;
  convertPrice: (priceInPKR: number) => number;
  formatPrice: (priceInPKR: number) => string;
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentCurrency, setCurrentCurrency] = useState('PKR');
  const [currencySymbol, setCurrencySymbol] = useState('₨');
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrencies();
    fetchUserPreference();
  }, [user]);

  useEffect(() => {
    if (currentCurrency !== 'PKR') {
      fetchExchangeRate();
    } else {
      setExchangeRate(1);
    }
  }, [currentCurrency]);

  const fetchCurrencies = async () => {
    const { data } = await supabase
      .from('currencies')
      .select('*')
      .eq('is_active', true)
      .order('code');
    
    if (data) {
      setCurrencies(data);
    }
  };

  const fetchUserPreference = async () => {
    if (!user) {
      // Use localStorage for non-logged-in users
      const saved = localStorage.getItem('preferred_currency');
      if (saved) {
        const currency = JSON.parse(saved);
        setCurrentCurrency(currency.code);
        setCurrencySymbol(currency.symbol);
      }
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('preferred_currency')
      .eq('id', user.id)
      .single();

    if (data?.preferred_currency) {
      const { data: currencyData } = await supabase
        .from('currencies')
        .select('*')
        .eq('code', data.preferred_currency)
        .single();
      
      if (currencyData) {
        setCurrentCurrency(currencyData.code);
        setCurrencySymbol(currencyData.symbol);
      }
    }
    setLoading(false);
  };

  const fetchExchangeRate = async () => {
    const { data } = await supabase
      .from('exchange_rates')
      .select('rate')
      .eq('from_currency', 'PKR')
      .eq('to_currency', currentCurrency)
      .single();

    if (data) {
      setExchangeRate(data.rate);
    }
  };

  const changeCurrency = async (code: string) => {
    const currency = currencies.find(c => c.code === code);
    if (!currency) return;

    setCurrentCurrency(code);
    setCurrencySymbol(currency.symbol);

    if (user) {
      await supabase
        .from('profiles')
        .update({ preferred_currency: code })
        .eq('id', user.id);
    } else {
      localStorage.setItem('preferred_currency', JSON.stringify({ 
        code: currency.code, 
        symbol: currency.symbol 
      }));
    }
  };

  const convertPrice = (priceInPKR: number): number => {
    return priceInPKR * exchangeRate;
  };

  const formatPrice = (priceInPKR: number): string => {
    const converted = convertPrice(priceInPKR);
    return `${currencySymbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{
      currentCurrency,
      currencySymbol,
      currencies,
      changeCurrency,
      convertPrice,
      formatPrice,
      loading,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};