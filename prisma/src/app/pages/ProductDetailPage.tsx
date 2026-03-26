'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  unit: string;
  description: string;
  benefits: string[];
  stock: boolean;
  category: string;
};

const productData: Record<string, Product> = {
  '1': {
    id: '1',
    name: 'Pure A2 Cow Milk',
    price: 80,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800',
    unit: '1L',
    description: 'Fresh A2 milk from indigenous Indian cows. Rich in proteins, vitamins, and minerals. Our cows are grass-fed and raised with love and care.',
    benefits: ['Rich in A2 beta-casein protein', 'Easily digestible', 'No antibiotics or hormones', 'Fresh daily delivery'],
    stock: true,
    category: 'Dairy Products'
  },
  '2': {
    id: '2',
    name: 'Desi Cow Ghee',
    price: 850,
    image: 'https://images.unsplash.com/photo-1628288789888-b4fa8e2e5759?w=800',
    unit: '500g',
    description: 'Traditional hand-churned ghee made from pure A2 cow milk. Golden yellow color with rich aroma and taste.',
    benefits: ['Made from A2 milk', 'Hand-churned using traditional bilona method', 'No preservatives', 'Rich in vitamins A, D, E, K'],
    stock: true,
    category: 'Dairy Products'
  },
  '3': {
    id: '3',
    name: 'Organic Cow Manure',
    price: 150,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800',
    unit: '5kg',
    description: 'Premium quality organic cow manure for your garden. Rich in nutrients and perfect for organic farming.',
    benefits: ['100% organic', 'Rich in nitrogen and phosphorus', 'Improves soil quality', 'Perfect for home gardens'],
    stock: true,
    category: 'Organic Products'
  },
  '4': {
    id: '4',
    name: 'Fresh Paneer',
    price: 200,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800',
    unit: '250g',
    description: 'Soft and fresh paneer made from pure cow milk. Perfect for all your cooking needs.',
    benefits: ['Made fresh daily', 'High protein content', 'No preservatives', 'Soft texture'],
    stock: true,
    category: 'Dairy Products'
  },
};

const reviews = [
  { name: 'Anita Desai', rating: 5, comment: 'Excellent quality! The milk is fresh and tastes amazing.', date: '2 weeks ago' },
  { name: 'Vikram Singh', rating: 5, comment: 'Best A2 milk in the city. Highly recommend!', date: '1 month ago' },
  { name: 'Meera Krishnan', rating: 4, comment: 'Good product. Delivery was on time.', date: '2 months ago' },
];

export const ProductDetailPage = ({ id }: { id: string }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = id ? productData[id] : null;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl mb-4 text-foreground">Product not found</h2>
        <Link href="/products" className="text-primary hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  };

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
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">{product.category}</div>
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">{product.name}</h1>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-accent fill-accent" />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">(4.8 rating)</span>
          </div>

          <div className="text-3xl text-primary mb-6">₹{product.price} <span className="text-base text-muted-foreground">/ {product.unit}</span></div>

          <p className="text-muted-foreground mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="text-foreground mb-3">Benefits</h3>
            <ul className="space-y-2">
              {product.benefits.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-4 mb-6">
              <label className="text-foreground">Quantity:</label>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-border">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
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
