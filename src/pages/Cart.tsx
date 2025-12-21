import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface City {
  id: string;
  name: string;
  province: string;
  shipping_zone: number;
}

const Cart = () => {
  const { items, loading, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [deliveryDays, setDeliveryDays] = useState<number>(0);
  const [isFreeShipping, setIsFreeShipping] = useState(false);

  const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan'];

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedCityId && total > 0) {
      calculateShipping();
    }
  }, [selectedCityId, total]);

  const fetchCities = async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching cities:', error);
      return;
    }
    
    setCities(data || []);
  };

  const calculateShipping = async () => {
    if (!selectedCityId) return;

    try {
      const { data, error } = await supabase.rpc('calculate_shipping', {
        p_city_id: selectedCityId,
        p_order_total: total
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const result = data[0];
        setShippingCost(result.shipping_cost || 0);
        setDeliveryDays(result.delivery_days || 0);
        setIsFreeShipping(result.shipping_cost === 0 && total >= 100000);
      }
    } catch (error: any) {
      console.error('Error calculating shipping:', error);
      toast({
        title: "Error",
        description: "Failed to calculate shipping cost",
        variant: "destructive",
      });
    }
  };

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedCityId('');
    setShippingCost(0);
    setDeliveryDays(0);
    setIsFreeShipping(false);
  };

  const handleProceedToCheckout = () => {
    if (!selectedProvince || !selectedCityId) {
      toast({
        title: "Location Required",
        description: "Please select your location before checking out.",
        variant: "destructive",
      });
      return;
    }

    const selectedCity = cities.find(c => c.id === selectedCityId);
    navigate('/checkout', {
      state: {
        province: selectedProvince,
        cityId: selectedCityId,
        cityName: selectedCity?.name,
        shippingCost,
        deliveryDays,
      }
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
            {items.map((item) => (
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
                    onValueChange={setSelectedCityId}
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

              <div className="border-t pt-4">
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
                      ) : isFreeShipping ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  {isFreeShipping && (
                    <div className="text-sm text-green-600 font-medium">
                      Free Shipping Applied
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
                      {selectedCityId ? formatPrice(total + shippingCost) : formatPrice(total)}
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
