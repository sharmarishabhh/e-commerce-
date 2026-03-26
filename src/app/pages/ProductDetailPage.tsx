'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  description: string | null;
  category: { id: string; name: string; slug: string };
}

const reviews = [
  { name: 'Anita Desai', rating: 5, comment: 'Excellent quality! The milk is fresh and tastes amazing.', date: '2 weeks ago' },
  { name: 'Vikram Singh', rating: 5, comment: 'Best A2 milk in the city. Highly recommend!', date: '1 month ago' },
  { name: 'Meera Krishnan', rating: 4, comment: 'Good product. Delivery was on time.', date: '2 months ago' },
];

export const ProductDetailPage = ({ id }: { id: string }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // id prop is the slug (from the URL segment /products/[slug])
        const res = await fetch(`/api/products/${id}`);
        if (res.status === 404) { setNotFound(true); return; }
        const data = await res.json();
        if (!data.success) { setNotFound(true); return; }
        setProduct(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.imageUrl ?? '',
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl mb-4 text-foreground">Product not found</h2>
        <Link href="/products" className="text-primary hover:underline">Back to Products</Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/products" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <div className="rounded-2xl overflow-hidden border border-border">
            <ImageWithFallback
              src={product.imageUrl ?? ''}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">{product.category.name}</div>
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-accent" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">(4.8 rating)</span>
          </div>

          <div className="text-3xl text-primary mb-6">₹{product.price}</div>

          {product.description && (
            <p className="text-muted-foreground mb-6">{product.description}</p>
          )}

          <div className="mb-4">
            {inStock ? (
              <span className="text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                {product.stock} in stock
              </span>
            ) : (
              <span className="text-sm text-destructive bg-destructive/10 px-3 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-4 mb-6">
              <label className="text-foreground">Quantity:</label>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-muted transition-colors">-</button>
                <span className="px-6 py-2 border-x border-border">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 py-2 hover:bg-muted transition-colors">+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl mb-6 text-foreground">Customer Reviews</h2>
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-foreground mb-1">{review.name}</div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};