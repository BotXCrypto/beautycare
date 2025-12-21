import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, XCircle, CreditCard, AlertCircle } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  payment_type: string;
  payment_status: string;
  status: string;
  created_at: string;
  address: any;
}

const ORDER_STATUSES = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Processing', label: 'Processing', icon: Package },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: CheckCircle },
];

const Orders = () => {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          setOrders(prev => prev.map(order => 
            order.id === payload.new.id ? { ...order, ...payload.new } : order
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Processing': return 'bg-blue-500';
      case 'Shipped': return 'bg-purple-500';
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-500';
      case 'Verified': return 'bg-green-500';
      case 'Pending': return 'bg-yellow-500';
      case 'Awaiting Verification': return 'bg-blue-500';
      case 'Failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentStepIndex = (status: string) => {
    if (status === 'Cancelled') return -1;
    const index = ORDER_STATUSES.findIndex(s => s.key === status);
    return index >= 0 ? index : 0;
  };

  const getDeliveryTimeRange = (address: any) => {
    const cityName = address?.city || '';
    const isDGKhan = cityName.toLowerCase().includes('dera ghazi khan') || 
                     cityName.toLowerCase().includes('dg khan') ||
                     cityName.toLowerCase().includes('d.g. khan');
    if (isDGKhan) return '1-2 days';
    return '3-5 days';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading orders...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">No orders yet</p>
            <Button variant="gradient" onClick={() => navigate('/shop')}>
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getCurrentStepIndex(order.status);
              const isCancelled = order.status === 'Cancelled';

              return (
                <Card key={order.id} className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-mono text-sm font-medium">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status</p>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Tracking */}
                  {!isCancelled && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold mb-4">Order Tracking</h3>
                      <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                          <div 
                            className="h-full bg-primary transition-all duration-500"
                            style={{ width: `${(currentStep / (ORDER_STATUSES.length - 1)) * 100}%` }}
                          />
                        </div>
                        
                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                          {ORDER_STATUSES.map((step, index) => {
                            const Icon = step.icon;
                            const isCompleted = index <= currentStep;
                            const isCurrent = index === currentStep;
                            
                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div 
                                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                    isCompleted 
                                      ? 'bg-primary text-primary-foreground' 
                                      : 'bg-muted text-muted-foreground'
                                  } ${isCurrent ? 'ring-4 ring-primary/30' : ''}`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Estimated Delivery */}
                      <div className="mt-4 text-sm text-muted-foreground text-center">
                        {order.status === 'Delivered' ? (
                          <span className="text-green-600 font-medium">Delivered successfully!</span>
                        ) : (
                          <span>Estimated delivery: {getDeliveryTimeRange(order.address)}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cancelled Order Message */}
                  {isCancelled && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">This order has been cancelled</span>
                    </div>
                  )}

                  {/* Payment & Delivery Info */}
                  <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm">{order.payment_type}</p>
                        <Badge variant="outline" className={`${getPaymentStatusColor(order.payment_status)} text-white border-0`}>
                          {order.payment_status}
                        </Badge>
                        {order.payment_status === 'Awaiting Verification' && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            We're verifying your payment
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Delivery Address
                      </p>
                      <p className="text-sm">
                        {order.address.fullName}, {order.address.phone}<br />
                        {order.address.addressLine1}, {order.address.city}<br />
                        {order.address.province} {order.address.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(order.address.shippingCost > 0 || order.address.codCharge > 0) && (
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      <div className="flex flex-wrap gap-4">
                        {order.address.shippingCost > 0 && (
                          <span>Shipping: {formatPrice(order.address.shippingCost)}</span>
                        )}
                        {order.address.codCharge > 0 && (
                          <span>COD Charge: {formatPrice(order.address.codCharge)}</span>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
