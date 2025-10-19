import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  inStock?: boolean;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  rating = 4.5,
  inStock = true,
}: ProductCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-large">
      <div className="relative aspect-square overflow-hidden bg-muted">
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
        >
          <Heart className="w-4 h-4" />
        </Button>
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
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
            <div className="text-xl font-bold text-primary">${price}</div>
            {originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                ${originalPrice}
              </div>
            )}
          </div>
          <Button variant="gradient" size="icon" disabled={!inStock}>
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
