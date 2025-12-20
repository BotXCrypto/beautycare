import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import BundleCard from "./BundleCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift } from "lucide-react";

interface BundleProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
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

const BundlesSection = () => {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
      const { data: bundlesData, error: bundlesError } = await supabase
        .from("bundles")
        .select("*")
        .eq("is_active", true)
        .limit(3);

      if (bundlesError) throw bundlesError;

      const bundlesWithProducts = await Promise.all(
        bundlesData.map(async (bundle) => {
          const { data: itemsData } = await supabase
            .from("bundle_items")
            .select(
              `
              quantity,
              products (
                id,
                title,
                price,
                image_url
              )
            `
            )
            .eq("bundle_id", bundle.id);

          const products = (itemsData || []).map((item: any) => ({
            ...item.products,
            quantity: item.quantity,
          }));

          return { ...bundle, products };
        })
      );

      setBundles(bundlesWithProducts);
    } catch (error) {
      console.error("Error fetching bundles:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-muted animate-pulse rounded mx-auto mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  if (bundles.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent mb-4">
          <Gift className="w-7 h-7 text-primary-foreground" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Gift Sets &{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bundles
          </span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Save more with our curated skincare bundles. Perfect for gifting or
          treating yourself!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <BundleCard
            key={bundle.id}
            id={bundle.id}
            name={bundle.name}
            description={bundle.description}
            image={bundle.image_url}
            discountPercentage={bundle.discount_percentage}
            products={bundle.products}
          />
        ))}
      </div>
      <div className="text-center mt-8">
        <Button variant="outline" size="lg" asChild>
          <Link to="/bundles">
            View All Bundles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default BundlesSection;
