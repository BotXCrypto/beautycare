import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  image: string;
  productCount: number;
  categoryId?: string;
}

const CategoryCard = ({ title, image, productCount, categoryId }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (categoryId) {
      navigate(`/shop?category=${categoryId}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <Card 
      onClick={handleClick}
      className="group cursor-pointer overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-large"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">{productCount} Products</p>
        <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform duration-300">
          Shop Now
          <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;
