import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Copy, CreditCard, Banknote, Smartphone, Clock, AlertCircle } from 'lucide-react';

type PaymentType = 'COD' | 'EasyPaisa' | 'BankDeposit' | 'Stripe';

const ACCOUNT_DETAILS = {
  accountHolder: 'Ubaidullah Ghouri',
  easyPaisa: '03101362920',
  bankAccount: '03101362920',
  iban: 'PK95SADA0000003101362920',
  bankName: 'SadaPay',
};

// COD charges
const COD_CHARGE_DG_KHAN = 150;
const COD_CHARGE_BASE = 50;

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<PaymentType>('COD');
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    postalCode: '',
    area: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  // Get location data from Cart page
  const locationState = location.state as {
    province?: string;
    cityId?: string;
    cityName?: string;
    shippingCost?: number;
    deliveryDays?: number;
    discountCode?: string;
    discountAmount?: number;
    deliveryDetails?: {
      fullName: string;
      phoneNumber: string;
      streetAddress: string;
      area: string;
      postalCode: string;
    };
  } | null;

  const province = locationState?.province || '';
  const cityId = locationState?.cityId || '';
  const cityName = locationState?.cityName || '';
  const baseShippingCost = locationState?.shippingCost || 0;
  const baseDeliveryDays = locationState?.deliveryDays || 0;
  const discountCode = locationState?.discountCode || '';
  const discountAmount = locationState?.discountAmount || 0;
  const deliveryDetailsFromCart = locationState?.deliveryDetails;
  const isFreeShipping = baseShippingCost === 0 && total >= 100000;

  // Pre-fill address from cart delivery details if provided
  useEffect(() => {
    if (deliveryDetailsFromCart) {
      setAddress(prev => ({
        ...prev,
        fullName: deliveryDetailsFromCart.fullName || prev.fullName,
        phone: deliveryDetailsFromCart.phoneNumber || prev.phone,
        addressLine1: deliveryDetailsFromCart.streetAddress || prev.addressLine1,
        area: deliveryDetailsFromCart.area || prev.area,
        postalCode: deliveryDetailsFromCart.postalCode || prev.postalCode,
      }));
    }
  }, [deliveryDetailsFromCart]);

  // Check if DG Khan
  const isDGKhan = cityName.toLowerCase().includes('dera ghazi khan') || 
                   cityName.toLowerCase().includes('dg khan') ||
                   cityName.toLowerCase().includes('d.g. khan');

  // Calculate COD extra charge
  const getCODCharge = () => {
    if (paymentType !== 'COD') return 0;
    return isDGKhan ? COD_CHARGE_DG_KHAN : COD_CHARGE_DG_KHAN + (baseShippingCost > 500 ? 100 : 50);
  };

  const codCharge = getCODCharge();
  const finalShippingCost = isFreeShipping ? 0 : baseShippingCost;
  const grandTotal = total - discountAmount + finalShippingCost + codCharge;

  // Get delivery time range
  const getDeliveryTimeRange = () => {
    if (isDGKhan) return '1-2 days';
    if (baseDeliveryDays <= 3) return `${baseDeliveryDays}-${baseDeliveryDays + 1} days`;
    if (baseDeliveryDays <= 5) return `${baseDeliveryDays}-${baseDeliveryDays + 2} days`;
    return `${baseDeliveryDays}-${baseDeliveryDays + 3} days`;
  };

  // Redirect to cart if no location selected
  useEffect(() => {
    if (!province || !cityId) {
      toast({
        title: "Location Required",
        description: "Please select your location from the cart page",
        variant: "destructive",
      });
      navigate('/cart');
    }
  }, [province, cityId, navigate]);

  // Validation functions
  const validateAddress = () => {
    const errors: Record<string, string> = {};

    if (!address.fullName.trim()) {
      errors.fullName = 'Full name is required';
    } else if (address.fullName.trim().length < 3) {
      errors.fullName = 'Full name must be at least 3 characters';
    }

    if (!address.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9\s\-\+\(\)]{10,}$/.test(address.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!address.addressLine1.trim()) {
      errors.addressLine1 = 'Address is required';
    } else if (address.addressLine1.trim().length < 5) {
      errors.addressLine1 = 'Address must be at least 5 characters';
    }

    if (!address.area.trim()) {
      errors.area = 'Area/Landmark is required';
    } else if (address.area.trim().length < 2) {
      errors.area = 'Area must be at least 2 characters';
    }

    if (!address.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    } else if (!/^\d{5}$/.test(address.postalCode.replace(/\s/g, ''))) {
      errors.postalCode = 'Postal code must be 5 digits';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddressChange = (field: string, value: string | null) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field on change
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentScreenshot(e.target.files[0]);
    }
  };

  const uploadScreenshot = async (): Promise<string | null> => {
    if (!paymentScreenshot || !user) return null;

    const fileExt = paymentScreenshot.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(`payment-proofs/${fileName}`, paymentScreenshot);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(`payment-proofs/${fileName}`);

    return data.publicUrl;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'PureAndPeak/1.0 (contact@pureandpeak.example)'
        }
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Reverse geocode error', err);
      return null;
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: 'Not supported', description: 'Geolocation is not supported by your browser', variant: 'destructive' });
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      const geo = await reverseGeocode(lat, lon);
      if (geo) {
        const addr = geo.address || {};
        const display = geo.display_name || '';
        setAddress(prev => ({
          ...prev,
          addressLine1: display || prev.addressLine1,
          postalCode: addr.postcode || prev.postalCode,
          area: addr.suburb || addr.neighbourhood || addr.village || addr.town || prev.area,
          latitude: lat,
          longitude: lon,
        }));
        toast({ title: 'Location captured', description: 'We filled your address from current location' });
      } else {
        toast({ title: 'Location failed', description: 'Could not get address from location', variant: 'destructive' });
      }
    }, (err) => {
      console.error('Geolocation error', err);
      toast({ title: 'Location error', description: 'Unable to get current location', variant: 'destructive' });
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to place an order",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    // Validate address fields
    if (!validateAddress()) {
      toast({
        title: "Validation Failed",
        description: "Please fix the errors in delivery address before placing order",
        variant: "destructive",
      });
      return;
    }

    // Validate payment proof for digital payments
    if ((paymentType === 'EasyPaisa' || paymentType === 'BankDeposit') && !transactionId && !paymentScreenshot) {
      toast({
        title: "Payment proof required",
        description: "Please provide transaction ID or upload payment screenshot",
        variant: "destructive",
      });
      return;
    }

    if (paymentType === 'Stripe') {
      toast({
        title: "Coming Soon",
        description: "Stripe payment will be available soon",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload screenshot if provided
      let screenshotUrl: string | null = null;
      if (paymentScreenshot) {
        screenshotUrl = await uploadScreenshot();
      }

      // Determine payment status
      const paymentStatus = paymentType === 'COD' ? 'Pending' : 'Awaiting Verification';

      // Create order with location data and payment info
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: grandTotal,
          payment_type: paymentType,
          payment_status: paymentStatus,
          status: 'Pending',
          address: {
            ...address,
            province: province,
            city: cityName,
            transactionId: transactionId || null,
            paymentScreenshot: screenshotUrl,
            codCharge: codCharge,
            shippingCost: finalShippingCost,
            discountCode: discountCode || null,
            discountAmount: discountAmount || 0,
          },
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: (item as any).unit_price_override ?? item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Track discount code usage if applied
      if (discountCode && discountAmount > 0) {
        // Increment used_count by 1
        const { data: codeData, error: fetchError } = await supabase
          .from('discount_codes')
          .select('used_count')
          .eq('code', discountCode)
          .single();
        
        if (!fetchError && codeData) {
          await supabase
            .from('discount_codes')
            .update({ used_count: (codeData.used_count || 0) + 1 })
            .eq('code', discountCode)
            .catch(err => console.error('Error tracking discount code usage:', err));
        }
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Order placed!",
        description: paymentType === 'COD' 
          ? "Your order has been placed. Pay on delivery." 
          : "Your order is pending payment verification.",
      });

      navigate(`/orders`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      required
                      value={address.fullName}
                      onChange={(e) => handleAddressChange('fullName', e.target.value)}
                      className={validationErrors.fullName ? 'border-red-500' : ''}
                    />
                    {validationErrors.fullName && (
                      <p className="text-xs text-red-500">{validationErrors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => handleAddressChange('phone', e.target.value)}
                      className={validationErrors.phone ? 'border-red-500' : ''}
                    />
                    {validationErrors.phone && (
                      <p className="text-xs text-red-500">{validationErrors.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={address.addressLine1}
                      onChange={(e) => handleAddressChange('addressLine1', e.target.value)}
                      className={validationErrors.addressLine1 ? 'border-red-500' : ''}
                    />
                    {validationErrors.addressLine1 && (
                      <p className="text-xs text-red-500">{validationErrors.addressLine1}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="area">Area / Landmark *</Label>
                      <Button type="button" variant="ghost" size="sm" onClick={handleUseCurrentLocation}>
                        Use current location
                      </Button>
                    </div>
                    <Input
                      id="area"
                      placeholder="Neighborhood, landmark, e.g. Near City Mall"
                      value={address.area}
                      onChange={(e) => handleAddressChange('area', e.target.value)}
                      className={validationErrors.area ? 'border-red-500' : ''}
                    />
                    {validationErrors.area && (
                      <p className="text-xs text-red-500">{validationErrors.area}</p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={address.addressLine2}
                      onChange={(e) => handleAddressChange('addressLine2', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={address.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className={validationErrors.postalCode ? 'border-red-500' : ''}
                    />
                    {validationErrors.postalCode && (
                      <p className="text-xs text-red-500">{validationErrors.postalCode}</p>
                    )}
                  </div>
                  {address.latitude && address.longitude && (
                    <div className="md:col-span-2 text-sm text-muted-foreground">
                      Current coordinates: {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Delivery Location</h3>
                  <p className="text-sm">
                    <span className="font-medium">Province:</span> {province}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">City:</span> {cityName}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Estimated delivery: {getDeliveryTimeRange()}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val as PaymentType)}>
                  {/* Cash on Delivery */}
                  <div className={`p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors ${paymentType === 'COD' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="COD" id="cod" className="mt-1" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-5 h-5 text-green-600" />
                          <span className="font-semibold">Cash on Delivery</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay when you receive your order</p>
                        <div className="mt-2 text-sm bg-amber-50 text-amber-800 p-2 rounded flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>Extra COD charge: {formatPrice(isDGKhan ? COD_CHARGE_DG_KHAN : getCODCharge())}</span>
                        </div>
                      </Label>
                    </div>
                  </div>

                  {/* EasyPaisa */}
                  <div className={`p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors mt-3 ${paymentType === 'EasyPaisa' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="EasyPaisa" id="easypaisa" className="mt-1" />
                      <Label htmlFor="easypaisa" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-5 h-5 text-green-500" />
                          <span className="font-semibold">EasyPaisa</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Send payment to our EasyPaisa account</p>
                      </Label>
                    </div>
                    
                    {paymentType === 'EasyPaisa' && (
                      <div className="mt-4 ml-7 space-y-3">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="font-semibold text-green-800 mb-2">EasyPaisa Account Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Holder:</span>
                              <span className="font-medium">{ACCOUNT_DETAILS.accountHolder}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{ACCOUNT_DETAILS.easyPaisa}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={() => copyToClipboard(ACCOUNT_DETAILS.easyPaisa, 'Account number')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="easypaisa-tid">Transaction ID</Label>
                          <Input
                            id="easypaisa-tid"
                            placeholder="Enter your EasyPaisa transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="easypaisa-screenshot">Payment Screenshot (optional)</Label>
                          <Input
                            id="easypaisa-screenshot"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bank Deposit */}
                  <div className={`p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors mt-3 ${paymentType === 'BankDeposit' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="BankDeposit" id="bank" className="mt-1" />
                      <Label htmlFor="bank" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Bank Deposit / Transfer</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Transfer to our SadaPay account</p>
                      </Label>
                    </div>
                    
                    {paymentType === 'BankDeposit' && (
                      <div className="mt-4 ml-7 space-y-3">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <p className="font-semibold text-blue-800 mb-2">Bank Account Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Bank:</span>
                              <span className="font-medium">{ACCOUNT_DETAILS.bankName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Holder:</span>
                              <span className="font-medium">{ACCOUNT_DETAILS.accountHolder}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Account Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{ACCOUNT_DETAILS.bankAccount}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={() => copyToClipboard(ACCOUNT_DETAILS.bankAccount, 'Account number')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">IBAN:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-xs">{ACCOUNT_DETAILS.iban}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2"
                                  onClick={() => copyToClipboard(ACCOUNT_DETAILS.iban, 'IBAN')}
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bank-tid">Transaction ID / Reference</Label>
                          <Input
                            id="bank-tid"
                            placeholder="Enter your bank transaction ID"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bank-screenshot">Payment Screenshot (optional)</Label>
                          <Input
                            id="bank-screenshot"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Stripe - Coming Soon */}
                  <div className={`p-4 border rounded-lg cursor-pointer transition-colors mt-3 opacity-60 ${paymentType === 'Stripe' ? 'border-primary bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="Stripe" id="stripe" className="mt-1" />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">Card Payment (Stripe)</span>
                          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Coming Soon</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Pay securely with credit/debit card</p>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>


              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/cart')}>
                  Back to Cart
                </Button>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  disabled={loading || paymentType === 'Stripe'} 
                  className="flex-1"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product.title} x{item.quantity}</span>
                    <span>{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(finalShippingCost)
                    )}
                  </span>
                </div>
                {isFreeShipping && (
                  <div className="text-xs text-green-600 font-semibold">
                    Free Shipping Applied - Orders ≥ {formatPrice(100000)} ship free!
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount {discountCode ? `(${discountCode})` : ''}:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                {paymentType === 'COD' && codCharge > 0 && (
                  <div className="flex justify-between text-amber-700">
                    <span>COD Charge:</span>
                    <span>{formatPrice(codCharge)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Delivery: {getDeliveryTimeRange()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
