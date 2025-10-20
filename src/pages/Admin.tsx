import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 });
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    image_url: '',
    brand: '',
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      return;
    }
    
    fetchStats();
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      const { count: ordersCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      
      const { count: customersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { data: orders } = await supabase
        .from('orders')
        .select('total');
      
      const revenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        products: productsCount || 0,
        orders: ordersCount || 0,
        customers: customersCount || 0,
        revenue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase.from('products').insert({
        title: newProduct.title,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        original_price: newProduct.original_price ? parseFloat(newProduct.original_price) : null,
        stock: parseInt(newProduct.stock),
        image_url: newProduct.image_url,
        brand: newProduct.brand,
      });

      if (error) throw error;

      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });

      setNewProduct({
        title: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        image_url: '',
        brand: '',
      });
      
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{stats.products}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">{stats.orders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Customers</p>
                <p className="text-2xl font-bold">{stats.customers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${stats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={newProduct.title}
                      onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={newProduct.brand}
                      onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price</Label>
                    <Input
                      id="original_price"
                      type="number"
                      step="0.01"
                      value={newProduct.original_price}
                      onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      required
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    />
                  </div>
                </div>
                <Button type="submit" variant="gradient">
                  Add Product
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
              <p className="text-muted-foreground">Order management coming soon...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
