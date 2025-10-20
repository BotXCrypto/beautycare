import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  original_price?: number;
  image_url: string;
  rating?: number;
  stock: number;
}

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchFeaturedProducts();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').limit(4);
    if (data) setCategories(data);
  };

  const fetchFeaturedProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .limit(4)
      .order('created_at', { ascending: false });
    if (data) setFeaturedProducts(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Category
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our wide selection of electronics and home appliances
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} title={category.name} image={category.image_url} productCount={0} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Check out our best deals and popular items
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.title}
              price={product.price}
              originalPrice={product.original_price}
              image={product.image_url}
              rating={product.rating}
              inStock={product.stock > 0}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
