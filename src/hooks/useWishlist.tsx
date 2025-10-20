import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from './use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    title: string;
    price: number;
    original_price?: number;
    image_url: string;
    stock: number;
  };
}

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          product:products(id, title, price, original_price, image_url, stock)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      setItems(data as WishlistItem[]);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to add items to wishlist",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (error) throw error;

      toast({
        title: "Added to wishlist",
        description: "Item has been added to your wishlist",
      });

      fetchWishlist();
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already in wishlist",
          description: "This item is already in your wishlist",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      toast({
        title: "Removed",
        description: "Item removed from wishlist",
      });

      fetchWishlist();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId);
  };

  return {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  };
}
