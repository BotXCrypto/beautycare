import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface City {
  id: string;
  name: string;
  province: string;
  shipping_zone: number;
}

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState<'COD' | 'Banking'>('COD');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [shippingCost, setShippingCost] = useState(500);
  const [deliveryDays, setDeliveryDays] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityId) {
      calculateShipping();
    }
  }, [selectedCityId, total]);

  const fetchCities = async () => {
    const { data } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (data) {
      setCities(data);
    }
  };

  const calculateShipping = async () => {
    const selectedCity = cities.find(c => c.id === selectedCityId);
    if (!selectedCity) return;

    // Assume origin is from zone 1 (major city)
    const { data, error } = await supabase
      .rpc('calculate_shipping_cost', {
        from_zone: 1,
        to_zone: selectedCity.shipping_zone,
        order_total: total
      });

    if (!error && data !== null) {
      setShippingCost(data);
    }
  };

  const handleCityChange = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setSelectedCityId(cityId);
      setAddress({
        ...address,
        city: city.name,
        state: city.province,
      });
      
      // Set delivery days based on city
      const isDGKhan = city.name.toLowerCase().includes('dera ghazi khan') || 
                       city.name.toLowerCase().includes('d.g. khan') ||
                       city.name.toLowerCase().includes('dg khan');
      setDeliveryDays(isDGKhan ? '2 days' : '3-4 days');
    }
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

    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: total + shippingCost,
          payment_type: paymentType,
          payment_status: paymentType === 'Banking' ? 'Pending' : 'Pending',
          status: 'Pending',
          address,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      toast({
        title: "Order placed!",
        description: "Your order has been placed successfully",
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
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={address.addressLine1}
                      onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={address.addressLine2}
                      onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="city">City *</Label>
                    <Select value={selectedCityId} onValueChange={handleCityChange} required>
                      <SelectTrigger id="city">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}, {city.province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      required
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val as 'COD' | 'Banking')}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="COD" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive your order</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="Banking" id="banking" />
                    <Label htmlFor="banking" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Online Banking / Stripe</div>
                      <div className="text-sm text-muted-foreground">Pay securely via bank transfer or card</div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {deliveryDays && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm font-semibold mb-1">📦 Estimated Delivery Time</p>
                    <p className="text-sm text-muted-foreground">
                      Your order will be delivered within <span className="font-semibold text-foreground">{deliveryDays}</span>
                      {deliveryDays === '2 days' && ' (DG Khan area)'}
                      {deliveryDays === '3-4 days' && ' (Outside DG Khan)'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/cart')}>
                  Back to Cart
                </Button>
                <Button type="submit" variant="gradient" disabled={loading} className="flex-1">
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
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {shippingCost === 0 && total >= 100000 && (
                  <div className="text-xs text-green-600">
                    🎉 Free shipping on orders above ₨100,000!
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{formatPrice(total + shippingCost)}</span>
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
