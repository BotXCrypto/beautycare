import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from '@/hooks/useCurrency';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Eye, CheckCircle, XCircle, Clock, Package, Truck, CreditCard, Image } from 'lucide-react';

interface Order {
  id: string;
  user_id: string;
  total: number;
  payment_type: string;
  payment_status: string;
  status: string;
  created_at: string;
  address: any;
}

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'Awaiting Verification', 'Verified', 'Paid', 'Failed'];

export const OrderManager = () => {
  const { formatPrice } = useCurrency();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending_payment'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'pending_payment') {
        query = query.in('payment_status', ['Pending', 'Awaiting Verification']);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Order status changed to ${status}`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Payment Status Updated',
        description: `Payment status changed to ${paymentStatus}`,
      });

      fetchOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Processing': return <Package className="w-4 h-4" />;
      case 'Shipped': return <Truck className="w-4 h-4" />;
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All Orders ({orders.length})
        </Button>
        <Button 
          variant={filter === 'pending_payment' ? 'default' : 'outline'}
          onClick={() => setFilter('pending_payment')}
          className="relative"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Pending Payments
          {filter === 'all' && orders.filter(o => ['Pending', 'Awaiting Verification'].includes(o.payment_status)).length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {orders.filter(o => ['Pending', 'Awaiting Verification'].includes(o.payment_status)).length}
            </span>
          )}
        </Button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No orders found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Order Info */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-medium">{order.id.slice(0, 8).toUpperCase()}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Payment Info */}
                <div className="min-w-[150px]">
                  <p className="text-sm text-muted-foreground mb-1">Payment</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{order.payment_type}</span>
                    <Badge variant="outline" className={`${getPaymentStatusColor(order.payment_status)} text-white border-0 text-xs`}>
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>

                {/* Total */}
                <div className="min-w-[100px]">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                      </DialogHeader>
                      {selectedOrder && (
                        <div className="space-y-4">
                          {/* Order ID & Date */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Order ID</p>
                              <p className="font-mono font-medium">{selectedOrder.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p>{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Update Status */}
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium mb-2">Order Status</p>
                              <Select 
                                value={selectedOrder.status} 
                                onValueChange={(val) => updateOrderStatus(selectedOrder.id, val)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ORDER_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Payment Status</p>
                              <Select 
                                value={selectedOrder.payment_status} 
                                onValueChange={(val) => updatePaymentStatus(selectedOrder.id, val)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {PAYMENT_STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {status}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <p className="text-sm font-medium mb-2">Payment Information</p>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Type:</span> {selectedOrder.payment_type}
                              </p>
                              {selectedOrder.address.transactionId && (
                                <p className="text-sm">
                                  <span className="text-muted-foreground">Transaction ID:</span> {selectedOrder.address.transactionId}
                                </p>
                              )}
                              {selectedOrder.address.paymentScreenshot && (
                                <div>
                                  <p className="text-sm text-muted-foreground mb-2">Payment Screenshot:</p>
                                  <a 
                                    href={selectedOrder.address.paymentScreenshot} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-primary hover:underline"
                                  >
                                    <Image className="w-4 h-4" />
                                    View Screenshot
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Customer & Address */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-2">Customer</p>
                              <p className="text-sm">{selectedOrder.address.fullName}</p>
                              <p className="text-sm text-muted-foreground">{selectedOrder.address.phone}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-2">Delivery Address</p>
                              <p className="text-sm">
                                {selectedOrder.address.addressLine1}<br />
                                {selectedOrder.address.addressLine2 && <>{selectedOrder.address.addressLine2}<br /></>}
                                {selectedOrder.address.city}, {selectedOrder.address.province}<br />
                                {selectedOrder.address.postalCode}
                              </p>
                            </div>
                          </div>

                          {/* Order Total */}
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Total Amount</span>
                              <span className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.total)}</span>
                            </div>
                            {(selectedOrder.address.shippingCost > 0 || selectedOrder.address.codCharge > 0) && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                {selectedOrder.address.shippingCost > 0 && (
                                  <span className="mr-4">Shipping: {formatPrice(selectedOrder.address.shippingCost)}</span>
                                )}
                                {selectedOrder.address.codCharge > 0 && (
                                  <span>COD Charge: {formatPrice(selectedOrder.address.codCharge)}</span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Quick Actions */}
                          <div className="flex gap-2 pt-4 border-t">
                            {selectedOrder.payment_status === 'Awaiting Verification' && (
                              <>
                                <Button 
                                  variant="default" 
                                  className="flex-1"
                                  onClick={() => {
                                    updatePaymentStatus(selectedOrder.id, 'Verified');
                                    setSelectedOrder({ ...selectedOrder, payment_status: 'Verified' });
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Verify Payment
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  className="flex-1"
                                  onClick={() => {
                                    updatePaymentStatus(selectedOrder.id, 'Failed');
                                    setSelectedOrder({ ...selectedOrder, payment_status: 'Failed' });
                                  }}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject Payment
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  {/* Quick Status Update */}
                  <Select 
                    value={order.status} 
                    onValueChange={(val) => updateOrderStatus(order.id, val)}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
