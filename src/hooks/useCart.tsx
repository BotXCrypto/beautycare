import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price_override?: number | null;
  bundle_id?: string | null;
  bundle_name?: string | null;
  bundle_discount_percentage?: number | null;
  product: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Fetch all columns from cart_items. We use a generic select `*`
      // because we can't be sure which optional columns (bundle_*, unit_price_override) exist.
      // The code will gracefully handle if they are missing from the result.
      const { data: cartRows, error: ciError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (ciError) {
        // If this basic select fails, something is very wrong.
        console.error("Error fetching cart items:", ciError);
        throw new Error("Could not fetch cart items. Please try again.");
      }

      const productIds = Array.from(new Set((cartRows || []).map(r => r.product_id))).filter(Boolean);

      if (productIds.length === 0) {
        setItems([]);
        setLoading(false); // Set loading to false here
        return;
      }

      // 2. Fetch products for the items in the cart.
      const { data: productsData, error: prodErr } = await supabase
        .from('products')
        .select('id, title, price, image_url, stock')
        .in('id', productIds);

      if (prodErr) {
        console.error("Error fetching product data for cart:", prodErr);
        throw new Error("Could not load product details for the cart.");
      }

      const prodMap = new Map<string, any>();
      (productsData || []).forEach((p: any) => prodMap.set(p.id, p));

      // 3. Merge the two datasets.
      const merged: CartItem[] = (cartRows || []).map(r => ({
        id: r.id,
        product_id: r.product_id,
        quantity: r.quantity,
        // Gracefully handle potentially missing columns from the select '*'
        unit_price_override: r.unit_price_override ?? null,
        bundle_id: r.bundle_id ?? null,
        bundle_name: r.bundle_name ?? null,
        bundle_discount_percentage: r.bundle_discount_percentage ?? null,
        product: prodMap.get(r.product_id) || { id: r.product_id, title: 'Unknown Product', price: 0, image_url: '', stock: 0 }
      }));

      setItems(merged);

    } catch (error: any) {
      console.error('Error in fetchCart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1, unitPrice?: number | null) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Try to upsert including unit_price_override if provided. If the
      // column does not exist on older DBs, fall back to upserting without it.
      try {
        const payload: any = {
          user_id: user.id,
          product_id: productId,
          quantity,
        };
        if (typeof unitPrice !== 'undefined') payload.unit_price_override = unitPrice ?? null;

        const { error } = await supabase
          .from('cart_items')
          .upsert(payload, { onConflict: 'user_id,product_id' });

        if (error) throw error;
      } catch (err) {
        // Attempt fallback without unit_price_override
        try {
          const { error } = await supabase
            .from('cart_items')
            .upsert({
              user_id: user.id,
              product_id: productId,
              quantity,
            }, { onConflict: 'user_id,product_id' });

          if (error) throw error;
        } catch (err2: any) {
          throw err2;
        }
      }

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });

      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addBundleToCart = async (
    bundleId: string,
    bundleName: string,
    bundleDiscountPercentage: number,
    products: Array<{ id: string; quantity: number; price: number }>
  ) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate original and discounted bundle price
      const originalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const discountedPrice = originalPrice * (1 - bundleDiscountPercentage / 100);
      const prorateFactor = originalPrice > 0 ? discountedPrice / originalPrice : 1;

      // Add each product with bundle_id and prorated unit price
      for (const product of products) {
        const proratedUnitPrice = Math.round((product.price * prorateFactor + Number.EPSILON) * 100) / 100;
        
        const payload: any = {
          user_id: user.id,
          product_id: product.id,
          quantity: product.quantity,
          bundle_id: bundleId,
          bundle_name: bundleName,
          bundle_discount_percentage: bundleDiscountPercentage,
          unit_price_override: proratedUnitPrice,
        };

        try {
          const { error } = await supabase
            .from('cart_items')
            .upsert(payload, { onConflict: 'user_id,product_id' });

          if (error) throw error;
        } catch (err) {
          // Fallback without bundle fields
          try {
            const { error } = await supabase
              .from('cart_items')
              .upsert({
                user_id: user.id,
                product_id: product.id,
                quantity: product.quantity,
                unit_price_override: proratedUnitPrice,
              }, { onConflict: 'user_id,product_id' });

            if (error) throw error;
          } catch (err2: any) {
            throw err2;
          }
        }
      }

      toast({
        title: "Bundle added!",
        description: `${bundleName} with ${bundleDiscountPercentage}% discount added to your cart.`,
      });

      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;
      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Item removed from cart",
      });

      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      fetchCart();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const total = items.reduce((sum, item) => {
    const price = item.unit_price_override ?? item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  return {
    items,
    loading,
    total,
    addToCart,
    addBundleToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };
}
