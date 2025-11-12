import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { TrendingUp, DollarSign, Calendar, Target } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DailyEarning {
  id: string;
  date: string;
  amount: number;
  orders_count: number;
  created_at: string;
}

interface EarningStats {
  today: number;
  week: number;
  month: number;
  total: number;
}

const Earnings = () => {
  const { user, isAdmin } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState<DailyEarning[]>([]);
  const [stats, setStats] = useState<EarningStats>({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchEarnings();
  }, [user, isAdmin, navigate]);

  const fetchEarnings = async () => {
    try {
      // Fetch completed orders grouped by date
      const { data: orders } = await supabase
        .from('orders')
        .select('created_at, total')
        .eq('status', 'Delivered')
        .order('created_at', { ascending: false });

      if (orders) {
        // Group by date
        const earningsByDate = orders.reduce((acc: any, order) => {
          const date = new Date(order.created_at).toLocaleDateString();
          if (!acc[date]) {
            acc[date] = { amount: 0, count: 0 };
          }
          acc[date].amount += Number(order.total);
          acc[date].count += 1;
          return acc;
        }, {});

        // Convert to array
        const earningsArray: DailyEarning[] = Object.entries(earningsByDate).map(
          ([date, data]: [string, any]) => ({
            id: date,
            date,
            amount: data.amount,
            orders_count: data.count,
            created_at: date,
          })
        );

        setEarnings(earningsArray);

        // Calculate stats
        const now = new Date();
        const today = now.toLocaleDateString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const todayEarnings = earningsArray.find((e) => e.date === today)?.amount || 0;
        const weekEarnings = earningsArray
          .filter((e) => new Date(e.date) >= weekAgo)
          .reduce((sum, e) => sum + e.amount, 0);
        const monthEarnings = earningsArray
          .filter((e) => new Date(e.date) >= monthAgo)
          .reduce((sum, e) => sum + e.amount, 0);
        const totalEarnings = earningsArray.reduce((sum, e) => sum + e.amount, 0);

        setStats({
          today: todayEarnings,
          week: weekEarnings,
          month: monthEarnings,
          total: totalEarnings,
        });
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center">Loading earnings data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Daily Earning{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Progress
            </span>
          </h1>
          <p className="text-muted-foreground">
            Track your revenue and sales performance
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatPrice(stats.today)}</p>
              <p className="text-sm text-muted-foreground mt-1">Current day earnings</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatPrice(stats.week)}</p>
              <p className="text-sm text-muted-foreground mt-1">Last 7 days</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">This Month</span>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatPrice(stats.month)}</p>
              <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">All Time</span>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatPrice(stats.total)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total earnings</p>
            </div>
          </Card>
        </div>

        {/* Earnings Table */}
        <Card className="p-6">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Orders</th>
                      <th className="text-right py-3 px-4">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center py-8 text-muted-foreground">
                          No earnings data available yet
                        </td>
                      </tr>
                    ) : (
                      earnings.map((earning) => (
                        <tr key={earning.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{earning.date}</td>
                          <td className="py-3 px-4">{earning.orders_count} orders</td>
                          <td className="py-3 px-4 text-right font-semibold">
                            {formatPrice(earning.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Average Daily Earnings</span>
                  <span className="font-semibold">
                    {formatPrice(earnings.length > 0 ? stats.total / earnings.length : 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Total Days with Sales</span>
                  <span className="font-semibold">{earnings.length} days</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Best Day Earnings</span>
                  <span className="font-semibold">
                    {formatPrice(Math.max(...earnings.map((e) => e.amount), 0))}
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Earnings;
