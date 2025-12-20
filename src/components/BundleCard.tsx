import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Gift } from "lucide-react";
import { useCurrency } from "@/hooks/useCurrency";
import { useNavigate } from "react-router-dom";

interface BundleProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface BundleCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  discountPercentage: number;
  products: BundleProduct[];
}

const BundleCard = ({
  id,
  name,
  description,
  image,
  discountPercentage,
  products,
}: BundleCardProps) => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const originalPrice = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const discountedPrice = originalPrice * (1 - discountPercentage / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-large">
      <div
        className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer"
        onClick={() => navigate(`/bundle/${id}`)}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-primary to-accent text-primary-foreground">
          <Gift className="w-3 h-3 mr-1" />
          Save {discountPercentage}%
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="flex -space-x-2">
            {products.slice(0, 4).map((product, index) => (
              <div
                key={product.id}
                className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                style={{ zIndex: 4 - index }}
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {products.length > 4 && (
              <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium">
                +{products.length - 4}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3
          className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors cursor-pointer"
          onClick={() => navigate(`/bundle/${id}`)}
        >
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-primary">
              {formatPrice(discountedPrice)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              <Badge variant="secondary" className="text-xs">
                Save {formatPrice(savings)}
              </Badge>
            </div>
          </div>
          <Button
            variant="gradient"
            size="icon"
            onClick={() => navigate(`/bundle/${id}`)}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BundleCard;
