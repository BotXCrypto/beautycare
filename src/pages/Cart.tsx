import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { useAuth } from '@/hooks/useAuth';
import { Minus, Plus, Trash2, ShoppingBag, Gift, MapPin, User, Phone } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DiceRoll from '@/components/DiceRoll';
import { useAdminSettings } from '@/hooks/useAdminSettings';

interface City {
  id: string;
  name: string;
  province: string;
  shipping_zone: number;
}

interface DiscountCode {
  id:string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount_amount?: number;
  min_order_value?: number;
}

interface DeliveryDetails {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  area: string;
  postalCode: string;
}

const Cart = () => {
  const { items, loading, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedCityName, setSelectedCityName] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [deliveryDays, setDeliveryDays] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loadingDiscount, setLoadingDiscount] = useState(false);

  const { settings: adminSettings, loading: loadingSettings } = useAdminSettings(['dice_discount_enabled']);
  const diceRollEnabled = adminSettings['dice_discount_enabled'] === true;

  const [diceReward, setDiceReward] = useState<any>(null);
  const [diceDiscountAmount, setDiceDiscountAmount] = useState(0);
  const [hasRolled, setHasRolled] = useState(false);
  const [diceFreeShipping, setDiceFreeShipping] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    area: '',
    postalCode: '',
  });

  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState<Partial<DeliveryDetails>>({});

  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Azad Kashmir', 'Gilgit-Baltistan', 'Islamabad Capital Territory'];

  // Validation functions
  const validateDeliveryDetails = () => {
    const errors: Partial<DeliveryDetails> = {};

    if (!deliveryDetails.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (deliveryDetails.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    }

    if (!deliveryDetails.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(deliveryDetails.phoneNumber.replace(/\s/g, ''))) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }

    if (!deliveryDetails.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    } else if (deliveryDetails.streetAddress.trim().length < 5) {
      errors.streetAddress = 'Street address must be at least 5 characters';
    }

    // Area is optional, only validate if provided
    if (deliveryDetails.area.trim() && deliveryDetails.area.trim().length < 2) {
      errors.area = 'Area must be at least 2 characters';
    }

    // Postal code is optional, only validate if provided
    if (deliveryDetails.postalCode.trim() && !/^\d{5}$/.test(deliveryDetails.postalCode.replace(/\s/g, ''))) {
      errors.postalCode = 'Postal code must be 5 digits';
    }

    // Log validation result for debugging
    if (Object.keys(errors).length > 0) {
      console.debug('Delivery details validation failed:', errors, 'current:', deliveryDetails);
    } else {
      console.debug('Delivery details validation passed', deliveryDetails);
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityId && total > 0) {
      calculateShipping();
    }
  }, [selectedCityId, total]);

  const fetchCities = async () => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching cities:', error);
        toast({
          title: "Error loading cities",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Cities loaded:', data?.length || 0);
      setCities(data || []);
    } catch (err: any) {
      console.error('Unexpected error fetching cities:', err);
    }
  };

  const calculateShipping = async () => {
    if (!selectedCityId) return;

    try {
      console.log('Calculating shipping for city:', selectedCityId, 'total:', total);
      
      const { data, error } = await supabase.rpc('calculate_shipping', {
        p_city_id: selectedCityId,
        p_order_total: total
      });

      if (error) {
        console.error('RPC error:', error);
        throw error;
      }

      console.log('Shipping calculation result:', data);

      if (data && data.length > 0) {
        const result = data[0];
        setShippingCost(result.shipping_cost || 0);
        setDeliveryDays(result.delivery_days || 0);
        setIsFreeShipping(result.shipping_cost === 0 && total >= 100000);
      } else {
        console.warn('No shipping data returned');
        setShippingCost(500); // Default fallback
        setDeliveryDays(3);
      }
    } catch (error: any) {
      console.error('Error calculating shipping:', error);
      // Set default values on error
      setShippingCost(500);
      setDeliveryDays(3);
      toast({
        title: "Error",
        description: "Using default shipping. " + error.message,
        variant: "destructive",
      });
    }
  };

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Enter code",
        description: "Please enter a discount code",
        variant: "destructive",
      });
      return;
    }

    if (discountCode.length < 3) {
      toast({
        title: "Invalid code",
        description: "Discount code must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    setLoadingDiscount(true);
    try {
      // Use type assertion to bypass TypeScript check for table that may not exist
      const { data, error } = await (supabase as any)
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.toUpperCase().trim())
        .eq('active', true)
        .single();

      if (error || !data) {
        throw new Error('Invalid or expired discount code');
      }

      const code = data as DiscountCode & { expires_at?: string };

      // Check if expired
      if (code.expires_at && new Date(code.expires_at) < new Date()) {
        throw new Error('This discount code has expired');
      }

      // Check minimum order value
      if (code.min_order_value && total < code.min_order_value) {
        throw new Error(`Minimum order value of ${formatPrice(code.min_order_value)} required`);
      }

      // Calculate discount amount
      let amount = 0;
      if (code.discount_type === 'percentage') {
        amount = (total * code.discount_value) / 100;
        if (code.max_discount_amount && amount > code.max_discount_amount) {
          amount = code.max_discount_amount;
        }
      } else {
        amount = code.discount_value;
      }

      setAppliedDiscount(code);
      setDiscountAmount(amount);
      toast({
        title: "Discount applied!",
        description: `You saved ${formatPrice(amount)}!`,
      });
    } catch (error: any) {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingDiscount(false);
    }
  };

  const removeDiscountCode = () => {
    setAppliedDiscount(null);
    setDiscountAmount(0);
    setDiscountCode('');
  };

  const handleDiceRollComplete = (reward: { type: string; value: number | null; label: string; diceTotal: number }) => {
    setHasRolled(true);
    setDiceReward(reward);

    if (reward.type === 'percentage' && reward.value) {
      const amount = (total * reward.value) / 100;
      setDiceDiscountAmount(amount);
      toast({
        title: 'Discount Applied!',
        description: `You got a ${reward.value}% discount!`,
      });
    } else if (reward.type === 'free_shipping') {
      setDiceFreeShipping(true);
      toast({
        title: 'Free Shipping Unlocked!',
        description: 'Your shipping is now free.',
      });
    } else if (reward.type === 'free_gift') {
        toast({
            title: 'You won a Free Gift!',
            description: 'A special gift will be added to your order.',
        });
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedCityId('');
    setSelectedCityName('');
    setShippingCost(0);
    setDeliveryDays(0);
    setIsFreeShipping(false);
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCityName(city.name);
    }
  };

  const handleDeliveryDetailsChange = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field on change
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProceedToCheckout = () => {
    console.log('Proceed to checkout clicked');
    console.log('Current state:', { selectedProvince, selectedCityId, selectedCityName, shippingCost, deliveryDays, total, showDeliveryForm });
    
    if (!selectedProvince || !selectedCityId) {
      console.warn('Missing location - cannot proceed:', { selectedProvince, selectedCityId });
      toast({
        title: "Location Required",
        description: "Please select your province and city before checking out.",
        variant: "destructive",
      });
      return;
    }

    if (showDeliveryForm) {
      const valid = validateDeliveryDetails();
      if (!valid) {
        console.warn('Delivery details invalid, aborting checkout. Errors:', validationErrors);
        toast({
          title: "Validation Failed",
          description: "Please fix the errors in delivery details before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    const checkoutState = {
      province: selectedProvince,
      cityId: selectedCityId,
      cityName: selectedCityName,
      shippingCost: (isFreeShipping || diceFreeShipping) ? 0 : shippingCost,
      deliveryDays,
      discountCode: appliedDiscount?.code,
      discountAmount: discountAmount,
      diceReward: diceReward,
      diceDiscountAmount: diceDiscountAmount,
      deliveryDetails: showDeliveryForm ? deliveryDetails : null,
    };

    console.log('Navigating to checkout with state:', checkoutState);

    // Store in sessionStorage as backup (React Router state sometimes doesn't persist)
    sessionStorage.setItem('checkoutData', JSON.stringify(checkoutState));

    navigate('/checkout', {
      state: checkoutState,
      replace: false
    });
  };

  const filteredCities = cities.filter(city => city.province === selectedProvince);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading cart...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Button variant="gradient" asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart}>
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {(() => {
              // Group items by bundle_id (bundles) and non-bundle items
              const bundleGroups: { [key: string]: typeof items } = {};
              const individualItems: typeof items = [];

              items.forEach(item => {
                if (item.bundle_id) {
                  if (!bundleGroups[item.bundle_id]) {
                    bundleGroups[item.bundle_id] = [];
                  }
                  bundleGroups[item.bundle_id].push(item);
                } else {
                  individualItems.push(item);
                }
              });

              return (
                <>
                  {/* Display bundles as grouped sections */}
                  {Object.entries(bundleGroups).map(([bundleId, bundleItems]) => {
                    const bundlePrice = bundleItems.reduce((sum, item) => {
                      const price = item.unit_price_override ?? item.product.price;
                      return sum + (price * item.quantity);
                    }, 0);

                    return (
                      <div key={bundleId} className="border-2 border-primary/20 rounded-lg overflow-hidden bg-primary/5">
                        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b">
                          <h3 className="text-lg font-bold text-primary">{bundleItems[0].bundle_name}</h3>
                          <p className="text-sm text-muted-foreground">Bundle with {bundleItems[0].bundle_discount_percentage}% discount</p>
                        </div>
                        <div className="p-4 space-y-2">
                          {bundleItems.map((item) => (
                            <div key={item.id} className="flex gap-3 pb-2 border-b last:border-b-0">
                              <img
                                src={item.product.image_url}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1 text-sm">
                                <p className="font-medium">{item.product.title}</p>
                                <p className="text-muted-foreground">Qty: {item.quantity}</p>
                                <p className="text-primary font-semibold">
                                  {formatPrice(item.unit_price_override ?? item.product.price)} each
                                </p>
                                {item.unit_price_override && item.unit_price_override < item.product.price && (
                                  <p className="text-xs text-green-600">
                                    Saved {formatPrice(item.product.price - item.unit_price_override)} per item
                                  </p>
                                )}
                              </div>
                              <div className="flex flex-col items-end justify-between">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                                <p className="font-bold">{formatPrice((item.unit_price_override ?? item.product.price) * item.quantity)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-primary/5 p-3 border-t font-bold text-primary text-right">
                          Bundle Total: {formatPrice(bundlePrice)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Display individual (non-bundle) items */}
                  {individualItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image_url}
                        alt={item.product.title}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.product.title}</h3>
                        <p className="text-lg font-bold text-primary">{formatPrice(item.product.price)}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                        <p className="font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Delivery Location</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Province</label>
                  <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">City</label>
                  <Select 
                    value={selectedCityId} 
                    onValueChange={handleCityChange}
                    disabled={!selectedProvince}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <button
                  onClick={() => setShowDeliveryForm(!showDeliveryForm)}
                  className="flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-3"
                >
                  <MapPin className="w-4 h-4" />
                  {showDeliveryForm ? "Hide" : "Add"} Delivery Details
                </button>

                {showDeliveryForm && (
                  <div className="bg-accent/5 rounded p-3 space-y-3 mb-4">
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Full Name *</label>
                      <Input
                        placeholder="Your name"
                        value={deliveryDetails.fullName}
                        onChange={(e) => handleDeliveryDetailsChange('fullName', e.target.value)}
                        className={`text-sm ${validationErrors.fullName ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Phone Number *</label>
                      <Input
                        placeholder="+923001234567"
                        value={deliveryDetails.phoneNumber}
                        onChange={(e) => handleDeliveryDetailsChange('phoneNumber', e.target.value)}
                        className={`text-sm ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.phoneNumber && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Street Address *</label>
                      <Input
                        placeholder="House no., street name"
                        value={deliveryDetails.streetAddress}
                        onChange={(e) => handleDeliveryDetailsChange('streetAddress', e.target.value)}
                        className={`text-sm ${validationErrors.streetAddress ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.streetAddress && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.streetAddress}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Area / Landmark (optional)</label>
                      <Input
                        placeholder="e.g., Near City Mall"
                        value={deliveryDetails.area}
                        onChange={(e) => handleDeliveryDetailsChange('area', e.target.value)}
                        className={`text-sm ${validationErrors.area ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.area && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.area}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1 block">Postal Code (optional)</label>
                      <Input
                        placeholder="e.g., 32200"
                        value={deliveryDetails.postalCode}
                        onChange={(e) => handleDeliveryDetailsChange('postalCode', e.target.value)}
                        className={`text-sm ${validationErrors.postalCode ? 'border-red-500' : ''}`}
                      />
                      {validationErrors.postalCode && (
                        <p className="text-xs text-red-500 mt-1">{validationErrors.postalCode}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Dice Roll Section */}
              {diceRollEnabled && items.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  {!hasRolled ? (
                    <DiceRoll onRollComplete={handleDiceRollComplete} />
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-800">
                          Reward Applied: {diceReward.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4 mt-4">
                <h2 className="text-lg font-bold mb-3">Discount Code</h2>
                {!appliedDiscount && !hasRolled && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      className="text-sm"
                      disabled={hasRolled}
                    />
                    <Button
                      size="sm"
                      onClick={applyDiscountCode}
                      disabled={loadingDiscount || !discountCode || hasRolled}
                    >
                      {loadingDiscount ? "..." : "Apply"}
                    </Button>
                  </div>
                )}
                {appliedDiscount && !hasRolled && (
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-green-800">{appliedDiscount.code}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeDiscountCode}
                        className="text-xs"
                      >
                        Remove
                      </Button>
                    </div>
                    <p className="text-xs text-green-700">Saved: {formatPrice(discountAmount)}</p>
                  </div>
                )}
                {hasRolled && (
                    <p className="text-xs text-center text-muted-foreground">Discount code is disabled when a dice reward is active.</p>
                )}
              </div>

              <div className="border-t pt-4 mt-4">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>
                      {!selectedCityId ? (
                        <span className="text-muted-foreground">Select location</span>
                      ) : (isFreeShipping || diceFreeShipping) ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {(isFreeShipping || diceFreeShipping) && (
                    <div className="text-sm text-green-600 font-medium">
                      {diceFreeShipping ? 'Dice Roll: Free Shipping!' : 'Free Shipping Applied'}
                    </div>
                  )}
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({appliedDiscount.code}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  {diceReward && diceDiscountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Dice Reward ({diceReward.label}):</span>
                      <span>-{formatPrice(diceDiscountAmount)}</span>
                    </div>
                  )}
                  {deliveryDays > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Estimated delivery: {deliveryDays <= 2 ? '1-2' : deliveryDays <= 4 ? `${deliveryDays}-${deliveryDays + 1}` : `${deliveryDays}-${deliveryDays + 2}`} days
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-primary">
                      {selectedCityId ? formatPrice(total + ((isFreeShipping || diceFreeShipping) ? 0 : shippingCost) - discountAmount - diceDiscountAmount) : formatPrice(total - discountAmount - diceDiscountAmount)}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="gradient" 
                  className="w-full"
                  onClick={handleProceedToCheckout}
                  disabled={!selectedProvince || !selectedCityId}
                >
                  Proceed to Checkout
                </Button>
                
                <Button variant="outline" className="w-full mt-2" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;