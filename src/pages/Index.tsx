import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import categoryAC from "@/assets/category-ac.jpg";
import categoryTV from "@/assets/category-tv.jpg";
import categoryIron from "@/assets/category-iron.jpg";
import categoryRemote from "@/assets/category-remote.jpg";

const categories = [
  { title: "Air Conditioners", image: categoryAC, productCount: 45 },
  { title: "TVs & Displays", image: categoryTV, productCount: 120 },
  { title: "Home Appliances", image: categoryIron, productCount: 78 },
  { title: "Accessories", image: categoryRemote, productCount: 200 },
];

const featuredProducts = [
  {
    name: "Smart LED TV 55 inch 4K Ultra HD",
    price: 599,
    originalPrice: 799,
    image: categoryTV,
    rating: 4.8,
  },
  {
    name: "Inverter Air Conditioner 1.5 Ton",
    price: 449,
    originalPrice: 599,
    image: categoryAC,
    rating: 4.6,
  },
  {
    name: "Steam Iron Professional 2400W",
    price: 49,
    originalPrice: 79,
    image: categoryIron,
    rating: 4.5,
  },
  {
    name: "Universal Remote Control Smart",
    price: 29,
    image: categoryRemote,
    rating: 4.7,
  },
];

const Index = () => {
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
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
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
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
