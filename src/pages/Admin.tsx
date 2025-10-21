import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Package, ShoppingCart, Users, DollarSign, Pencil, Trash2, Plus } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  stock: number;
  image_url: string;
  brand: string;
}

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, orders: 0, customers: 0, revenue: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
    fetchProducts();
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

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      fetchProducts();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: editingProduct.title,
          description: editingProduct.description,
          price: editingProduct.price,
          original_price: editingProduct.original_price,
          stock: editingProduct.stock,
          image_url: editingProduct.image_url,
          brand: editingProduct.brand,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });

      setEditingProduct(null);
      fetchProducts();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });

      fetchStats();
      fetchProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      original_price: '',
      stock: '',
      image_url: '',
      brand: '',
    });
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
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
            <div className="mb-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" onClick={openAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          required
                          value={editingProduct ? editingProduct.title : newProduct.title}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, title: e.target.value })
                              : setNewProduct({ ...newProduct, title: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          value={editingProduct ? editingProduct.brand : newProduct.brand}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, brand: e.target.value })
                              : setNewProduct({ ...newProduct, brand: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingProduct ? editingProduct.description : newProduct.description}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, description: e.target.value })
                              : setNewProduct({ ...newProduct, description: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (PKR) *</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          required
                          value={editingProduct ? editingProduct.price : newProduct.price}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })
                              : setNewProduct({ ...newProduct, price: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price (PKR)</Label>
                        <Input
                          id="original_price"
                          type="number"
                          step="0.01"
                          value={editingProduct ? (editingProduct.original_price || '') : newProduct.original_price}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, original_price: e.target.value ? parseFloat(e.target.value) : null })
                              : setNewProduct({ ...newProduct, original_price: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          required
                          value={editingProduct ? editingProduct.stock : newProduct.stock}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })
                              : setNewProduct({ ...newProduct, stock: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          type="url"
                          value={editingProduct ? editingProduct.image_url : newProduct.image_url}
                          onChange={(e) => 
                            editingProduct 
                              ? setEditingProduct({ ...editingProduct, image_url: e.target.value })
                              : setNewProduct({ ...newProduct, image_url: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="gradient">
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.image_url || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span className="text-muted-foreground">Stock: {product.stock}</span>
                      {product.brand && (
                        <span className="text-muted-foreground">{product.brand}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEditDialog(product)}
                      >
                        <Pencil className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products yet</p>
                <Button variant="gradient" onClick={openAddDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            )}
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
