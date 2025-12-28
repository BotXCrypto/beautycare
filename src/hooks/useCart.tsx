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
      // Robust fetching with retries and fallbacks. Some DB deployments
      // may lack columns or relational definitions which cause 400.
      const maxAttempts = 3;
      const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.debug(`fetchCart attempt ${attempt}`);
          // First attempt: try full select with unit_price_override
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              id,
              product_id,
              quantity,
              unit_price_override,
              product:products(id, title, price, image_url, stock)
            `)
            .eq('user_id', user.id);

          if (!error && data) {
            setItems(data as CartItem[]);
            break;
          }

          // If we get a client error (400) or unknown column, attempt fallback
          // to a safer query that fetches cart_items and then fetches products
          console.warn('Initial cart_items select failed', { attempt, error });

          // Fetch cart_items without relational product field
          const { data: ciData, error: ciError } = await supabase
            .from('cart_items')
            .select(`id, product_id, quantity, unit_price_override`)
            .eq('user_id', user.id);

          if (ciError) {
            // For server errors, retry a few times
            if (attempt < maxAttempts && (ciError?.status === 502 || ciError?.status === 503 || ciError?.status === 504)) {
              const backoff = attempt * 300;
              console.debug(`Transient error fetching cart_items, retrying in ${backoff}ms`, ciError);
              await sleep(backoff);
              continue;
            }
            throw ciError;
          }

          const cartRows = (ciData as any[]) || [];
          const productIds = Array.from(new Set(cartRows.map(r => r.product_id))).filter(Boolean);

          // If there are no products, set items to empty
          if (productIds.length === 0) {
            setItems([]);
            break;
          }

          // Fetch products separately and merge
          const { data: productsData, error: prodErr } = await supabase
            .from('products')
            .select('id, title, price, image_url, stock')
            .in('id', productIds);

          if (prodErr) {
            throw prodErr;
          }

          const prodMap = new Map<string, any>();
          (productsData || []).forEach((p: any) => prodMap.set(p.id, p));

          const merged: CartItem[] = cartRows.map(r => ({
            id: r.id,
            product_id: r.product_id,
            quantity: r.quantity,
            unit_price_override: r.unit_price_override ?? null,
            product: prodMap.get(r.product_id) || { id: r.product_id, title: 'Unknown', price: 0, image_url: '', stock: 0 }
          }));

          setItems(merged);
          break;
        } catch (err: any) {
          console.error(`fetchCart attempt ${attempt} error:`, err);
          if (attempt < maxAttempts) {
            const backoff = attempt * 300;
            await sleep(backoff);
            continue;
          }
          throw err;
        }
      }
    } catch (error: any) {
      console.error('Error fetching cart:', error);
      toast({
        title: "Error",
        description: "Failed to load cart",
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
