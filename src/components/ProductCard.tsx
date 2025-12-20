import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { StockBadge } from "@/components/product/StockBadge";

interface ProductCardProps {
  id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  stock?: number;
  lowStockThreshold?: number;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating = 4.5,
  stock = 10,
  lowStockThreshold = 5,
}: ProductCardProps) => {
  const inStock = stock > 0;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID not available",
        variant: "destructive",
      });
      return;
    }
    await addToCart(id, 1);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToCart();
  };

  const handleAddToWishlist = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Product ID not available",
        variant: "destructive",
      });
      return;
    }
    await addToWishlist(id);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleAddToWishlist();
  };

  return (
    <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-large">
      <div 
        className="relative aspect-square overflow-hidden bg-muted cursor-pointer"
        onClick={() => id && navigate(`/product/${id}`)}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
            {discount}% OFF
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 backdrop-blur hover:bg-background"
          onClick={handleWishlistClick}
        >
          <Heart className={`w-4 h-4 ${id && isInWishlist(id) ? 'fill-primary text-primary' : ''}`} />
        </Button>
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 
          className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => id && navigate(`/product/${id}`)}
        >
          {name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(rating) ? "text-primary" : "text-muted"}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-primary">{formatPrice(price)}</div>
            {originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </div>
            )}
          </div>
          <Button variant="gradient" size="icon" disabled={!inStock} onClick={handleCartClick}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
