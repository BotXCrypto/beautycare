import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useCurrency } from '@/hooks/useCurrency';
import { toast } from '@/hooks/use-toast';
import { VariantSelector } from '@/components/product/VariantSelector';
import { StockBadge } from '@/components/product/StockBadge';

interface Product {
  id: string;
  title: string;
  description?: string;
  brand?: string;
  price: number;
  original_price?: number;
  rating?: number;
  stock: number;
  image_url?: string;
  low_stock_threshold?: number;
}

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Variant {
  id: string;
  variant_type: string;
  variant_name: string;
  variant_value?: string;
  image_url?: string;
  price: number;
  original_price?: number;
  stock: number;
  is_active: boolean;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchImages();
      fetchVariants();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
      if (data.image_url) setSelectedImage(data.image_url);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({ title: 'Error loading product', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('display_order');

      if (error) throw error;
      if (data && data.length > 0) {
        setImages(data);
        setSelectedImage(data[0].image_url);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setVariants(data || []);
      // Auto-select first variant if available
      if (data && data.length > 0) {
        const firstInStock = data.find(v => v.stock > 0) || data[0];
        setSelectedVariant(firstInStock);
        if (firstInStock.image_url) {
          setSelectedImage(firstInStock.image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);
    if (variant.image_url) {
      setSelectedImage(variant.image_url);
    }
  };

  const handleAddToCart = async () => {
    if (!product?.id) return;
    
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
    if (currentStock === 0) {
      toast({ title: 'This item is out of stock', variant: 'destructive' });
      return;
    }
    
    await addToCart(product.id, 1);
  };

  const handleAddToWishlist = async () => {
    if (!product?.id) return;
    await addToWishlist(product.id);
  };

  // Use variant price/stock if selected, otherwise product price/stock
  const displayPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const displayOriginalPrice = selectedVariant ? selectedVariant.original_price : product?.original_price;
  const displayStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;

  const discount = displayOriginalPrice 
    ? Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-square bg-muted rounded-lg" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square bg-muted rounded" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-32 bg-muted rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-muted-foreground">Product not found</p>
        </main>
        <Footer />
      </div>
    );
  }

  const displayImages = images.length > 0 ? images : (product.image_url ? [{ id: '0', image_url: product.image_url, display_order: 0 }] : []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{discount}%
                </Badge>
              )}
            </div>

            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {displayImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedImage === img.image_url
                        ? 'border-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={`${product.title} view ${img.display_order + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
              {product.brand && (
                <p className="text-muted-foreground">Brand: {product.brand}</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({product.rating || 0})
                </span>
              </div>
              <StockBadge stock={displayStock} lowStockThreshold={product.low_stock_threshold} />
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">{formatPrice(displayPrice)}</span>
                {displayOriginalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(displayOriginalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="border rounded-lg p-4">
                <VariantSelector
                  variants={variants}
                  selectedVariant={selectedVariant}
                  onSelect={handleVariantSelect}
                />
              </div>
            )}

            {product.description && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={displayStock === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {displayStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;