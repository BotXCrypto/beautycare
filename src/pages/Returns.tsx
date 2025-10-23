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
      const { data, error } = await supabase
        .from('orders')
        .select('id, total, status, created_at')
        .eq('user_id', user?.id)
        .in('status', ['Delivered', 'Shipped'])
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
        description: "We'll review your request and contact you soon",
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
        <h1 className="text-4xl font-bold mb-8">Returns & Refunds</h1>

        <div className="max-w-2xl">
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>• Returns accepted within 30 days of delivery</p>
              <p>• Items must be unused and in original packaging</p>
              <p>• Refund processed within 5-7 business days</p>
              <p>• Free return shipping for defective items</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Submit Return Request</h2>
            
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No eligible orders for return</p>
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
                          Order {order.id.slice(0, 8)}... - ${order.total} - {new Date(order.created_at).toLocaleDateString()}
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
                      <SelectItem value="defective">Defective or Damaged</SelectItem>
                      <SelectItem value="wrong">Wrong Item Received</SelectItem>
                      <SelectItem value="notasexpected">Not as Expected</SelectItem>
                      <SelectItem value="changed">Changed Mind</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please describe the issue in detail..."
                    value={returnForm.description}
                    onChange={(e) => setReturnForm({ ...returnForm, description: e.target.value })}
                    required
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="gradient" 
                  disabled={submitting || !returnForm.order_id || !returnForm.reason}
                >
                  {submitting ? 'Submitting...' : 'Submit Return Request'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Returns;
