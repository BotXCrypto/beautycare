import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const FirstTimeBuyerBanner = () => {
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkFirstTimeBuyer();
  }, [user]);

  const checkFirstTimeBuyer = async () => {
    // Check if banner was dismissed in this session
    const sessionDismissed = sessionStorage.getItem("discountBannerDismissed");
    if (sessionDismissed) {
      setDismissed(true);
      return;
    }

    if (!user) {
      // Show banner for non-logged-in users to encourage signup
      setShowBanner(true);
      return;
    }

    // Check if user has any previous orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", user.id)
      .limit(1);

    if (error) {
      console.error("Error checking orders:", error);
      return;
    }

    // Show banner only if user has no orders (first-time buyer)
    if (!orders || orders.length === 0) {
      setShowBanner(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("discountBannerDismissed", "true");
  };

  if (!showBanner || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground py-3 px-4 relative animate-fade-in">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <Gift className="h-5 w-5 animate-pulse" />
        <p className="text-sm md:text-base font-medium text-center">
          💸 <span className="font-bold">First-Time Buyer Discount:</span> Get{" "}
          <span className="font-bold text-lg">10% OFF</span> on your first order!
          {!user && (
            <span className="ml-2 opacity-90">
              Sign up now to claim your discount.
            </span>
          )}
        </p>
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-primary-foreground/10 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default FirstTimeBuyerBanner;
