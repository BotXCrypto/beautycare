import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BundleCard from "@/components/BundleCard";
import { Gift } from "lucide-react";

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

const Bundles = () => {
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
        .eq("is_active", true);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mb-4">
            <Gift className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gift Sets &{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bundles
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated skincare bundles with exclusive discounts.
            Perfect for gifting or building your complete skincare routine.
          </p>
        </div>

        {/* Bundles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No bundles available at the moment
            </p>
          </div>
        ) : (
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Bundles;
