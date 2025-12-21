import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle, XCircle, Package, Clock, ShieldCheck } from 'lucide-react';

interface Order {
  id: string;
  total: number;
  status: string;
  created_at: string;
}

const Returns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [returnForm, setReturnForm] = useState({
    order_id: '',
    reason: '',
    description: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      // Only show orders from last 24 hours that are delivered or being delivered
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data, error } = await supabase
        .from('orders')
        .select('id, total, status, created_at')
        .eq('user_id', user?.id)
        .in('status', ['Delivered', 'Shipped'])
        .gte('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !returnForm.order_id) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          name: user.email || 'User',
          email: user.email || '',
          message: `RETURN REQUEST\nOrder ID: ${returnForm.order_id}\nReason: ${returnForm.reason}\nDescription: ${returnForm.description}`,
        });

      if (error) throw error;

      toast({
        title: "Return request submitted",
        description: "We'll review your request and contact you within 24 hours",
      });

      setReturnForm({ order_id: '', reason: '', description: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Returns & Refunds</h1>
        <p className="text-muted-foreground mb-8">Return policy for UG Cosmetics & Beauty Products</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Return Policy */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Our Return Policy</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                At UG Cosmetics, we want you to be completely satisfied with your purchase. 
                We accept returns under specific conditions to ensure product quality and safety for all our customers.
              </p>

              {/* Eligible for Return */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-800">Eligible for Return</h3>
                    <ul className="mt-2 space-y-1 text-sm text-green-700">
                      <li>• Wrong product received (different from what you ordered)</li>
                      <li>• Damaged or broken products on arrival</li>
                      <li>• Product quality issues (leaking, expired, defective)</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-800">NOT Eligible for Return</h3>
                    <ul className="mt-2 space-y-1 text-sm text-red-700">
                      <li>• Change of mind after receiving the product</li>
                      <li>• Product opened or used (for hygiene reasons)</li>
                      <li>• Order cancelled after dispatch</li>
                      <li>• Returns requested after 24 hours of delivery</li>
                      <li>• Product refused at delivery by customer</li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800">Important Conditions</h3>
                    <ul className="mt-2 space-y-1 text-sm text-amber-700">
                      <li>• Returns must be requested within <strong>24 hours</strong> of delivery</li>
                      <li>• Product must be in original packaging</li>
                      <li>• Photo/video evidence of damage is required</li>
                      <li>• Keep the delivery receipt until return is processed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Return Process</h2>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Submit Return Request</h4>
                    <p className="text-sm text-muted-foreground">Fill out the return form with your order details and reason</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Wait for Approval</h4>
                    <p className="text-sm text-muted-foreground">Our team will review your request within 24 hours</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Return Pickup</h4>
                    <p className="text-sm text-muted-foreground">Our delivery person will collect the item from your address</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                  <div>
                    <h4 className="font-semibold">Refund/Replacement</h4>
                    <p className="text-sm text-muted-foreground">Receive your refund or replacement within 3-5 business days</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">Order Cancellation</h2>
              </div>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Before Dispatch:</strong> You can cancel your order anytime before it's dispatched by contacting us via WhatsApp or phone.
                </p>
                <p>
                  <strong className="text-foreground">After Dispatch:</strong> Once the order is dispatched, it cannot be cancelled. If you refuse to receive the parcel from the delivery person, you will be responsible for shipping charges.
                </p>
                <p>
                  <strong className="text-foreground">COD Orders:</strong> If you cancel a COD order after dispatch or refuse delivery, we may restrict COD option for future orders.
                </p>
              </div>
            </Card>
          </div>

          {/* Return Request Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Submit Return Request</h2>
              
              {orders.length === 0 ? (
                <div className="text-center py-6">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No eligible orders for return. Returns can only be requested within 24 hours of delivery.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">Select Order</Label>
                    <Select 
                      value={returnForm.order_id} 
                      onValueChange={(value) => setReturnForm({ ...returnForm, order_id: value })}
                    >
                      <SelectTrigger id="order">
                        <SelectValue placeholder="Choose an order" />
                      </SelectTrigger>
                      <SelectContent>
                        {orders.map((order) => (
                          <SelectItem key={order.id} value={order.id}>
                            #{order.id.slice(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Return</Label>
                    <Select 
                      value={returnForm.reason} 
                      onValueChange={(value) => setReturnForm({ ...returnForm, reason: value })}
                    >
                      <SelectTrigger id="reason">
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wrong_product">Wrong Product Received</SelectItem>
                        <SelectItem value="damaged">Damaged or Broken</SelectItem>
                        <SelectItem value="defective">Product Defective</SelectItem>
                        <SelectItem value="expired">Expired Product</SelectItem>
                        <SelectItem value="quality">Quality Issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Please describe the issue in detail. Include product name and what's wrong..."
                      value={returnForm.description}
                      onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                      required
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Please attach photos/videos via WhatsApp after submitting
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    variant="gradient" 
                    className="w-full"
                    disabled={submitting || !returnForm.order_id || !returnForm.reason}
                  >
                    {submitting ? 'Submitting...' : 'Submit Return Request'}
                  </Button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us on WhatsApp: <strong>0310-1362920</strong>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
