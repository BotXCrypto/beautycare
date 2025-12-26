import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useCurrency } from "@/hooks/useCurrency";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Gift, Check, ArrowLeft } from "lucide-react";

interface BundleProduct {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  image_url: string;
  description: string;
  quantity: number;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  image_url: string;
  discount_percentage: number;
  products: BundleProduct[];
}

const BundleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBundleToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) fetchBundle();
  }, [id]);

  const fetchBundle = async () => {
    try {
      const { data: bundleData, error: bundleError } = await supabase
        .from("bundles")
        .select("*")
        .eq("id", id)
        .single();

      if (bundleError) throw bundleError;

      const { data: itemsData, error: itemsError } = await supabase
        .from("bundle_items")
        .select(
          `
          quantity,
          products (
            id,
            title,
            price,
            original_price,
            image_url,
            description
          )
        `
        )
        .eq("bundle_id", id);

      if (itemsError) throw itemsError;

      const products = itemsData.map((item: any) => ({
        ...item.products,
        quantity: item.quantity,
      }));

      setBundle({
        ...bundleData,
        products,
      });
    } catch (error) {
      console.error("Error fetching bundle:", error);
      toast({
        title: "Error",
        description: "Failed to load bundle details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBundleToCart = async () => {
    if (!bundle) return;

    setAdding(true);
    try {
      await addBundleToCart(
        bundle.id,
        bundle.name,
        bundle.discount_percentage,
        bundle.products.map(p => ({ id: p.id, quantity: p.quantity, price: p.price }))
      );
      toast({
        title: "Bundle Added!",
        description: `${bundle.name} has been added to your cart with ${bundle.discount_percentage}% discount applied.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add bundle to cart",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4" />
                <div className="h-20 bg-muted rounded" />
                <div className="h-12 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Bundle Not Found</h1>
            <Button onClick={() => navigate("/shop")}>Back to Shop</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const originalPrice = bundle.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );
  const discountedPrice =
    originalPrice * (1 - bundle.discount_percentage / 100);
  const savings = originalPrice - discountedPrice;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Bundle Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={bundle.image_url}
              alt={bundle.name}
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-primary to-accent text-primary-foreground text-lg px-4 py-2">
              <Gift className="w-4 h-4 mr-2" />
              Save {bundle.discount_percentage}%
            </Badge>
          </div>

          {/* Bundle Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {bundle.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {bundle.description}
              </p>
            </div>

            {/* Pricing */}
            <div className="bg-muted/50 rounded-xl p-6">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(originalPrice)}
                </span>
              </div>
              <Badge variant="secondary" className="text-base">
                You save {formatPrice(savings)}!
              </Badge>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-lg font-semibold mb-4">What's Included:</h3>
              <div className="space-y-3">
                {bundle.products.map((product) => (
                  <Card
                    key={product.id}
                    className="flex items-center gap-4 p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">
                        {product.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Qty: {product.quantity} × {formatPrice(product.price)}
                      </p>
                    </div>
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Add to Cart */}
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={handleAddBundleToCart}
              disabled={adding}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {adding ? "Adding..." : "Add Bundle to Cart"}
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              All {bundle.products.length} products will be added to your cart
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BundleDetail;
