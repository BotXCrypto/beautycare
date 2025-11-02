import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useCurrency } from '@/hooks/useCurrency';
import { Heart, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const { items, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleMoveToCart = async (productId: string, wishlistItemId: string) => {
    await addToCart(productId, 1);
    await removeFromWishlist(wishlistItemId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading wishlist...</p>
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
          <Heart className="w-24 h-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Add items you love to your wishlist</p>
          <Button variant="gradient" asChild>
            <Link to="/shop">Browse Products</Link>
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
        <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden">
              <img
                src={item.product.image_url}
                alt={item.product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{item.product.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-xl font-bold text-primary">{formatPrice(item.product.price)}</div>
                    {item.product.original_price && (
                      <div className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.product.original_price)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleMoveToCart(item.product_id, item.id)}
                    disabled={item.product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wishlist;
