
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Filter, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';

const allProducts = [
  { id: '1', name: 'Pure A2 Cow Milk', price: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'dairy', unit: '1L', stock: true },
  { id: '2', name: 'Desi Cow Ghee', price: 850, image: 'https://images.unsplash.com/photo-1628288789888-b4fa8e2e5759?w=400', category: 'dairy', unit: '500g', stock: true },
  { id: '3', name: 'Organic Cow Manure', price: 150, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', category: 'organic', unit: '5kg', stock: true },
  { id: '4', name: 'Fresh Paneer', price: 200, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'dairy', unit: '250g', stock: true },
  { id: '5', name: 'Fresh Curd', price: 60, image: 'https://images.unsplash.com/photo-1625937286074-9ca519d5d9df?w=400', category: 'dairy', unit: '500g', stock: true },
  { id: '6', name: 'Cow Butter', price: 450, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400', category: 'dairy', unit: '500g', stock: true },
  { id: '7', name: 'Vermicompost', price: 200, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'organic', unit: '10kg', stock: true },
  { id: '8', name: 'Cow Dung Cakes', price: 100, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', category: 'organic', unit: '20 pieces', stock: false },
];

export const ProductListingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(false);
  const { addToCart } = useCart();

  const filteredProducts = allProducts.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory) return false;
    if (availabilityFilter && !product.stock) return false;
    if (priceRange === 'low' && product.price > 200) return false;
    if (priceRange === 'medium' && (product.price <= 200 || product.price > 500)) return false;
    if (priceRange === 'high' && product.price <= 500) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl mb-2 text-foreground">Our Products</h1>
        <p className="text-muted-foreground">Pure, organic products from our gaushala</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-foreground">Filters</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-3 text-foreground">Category</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">All Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="dairy"
                      checked={selectedCategory === 'dairy'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">Dairy Products</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="organic"
                      checked={selectedCategory === 'organic'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">Organic Manure</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="block text-sm mb-3 text-foreground">Price Range</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="all"
                      checked={priceRange === 'all'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="low"
                      checked={priceRange === 'low'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">Under ₹200</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="medium"
                      checked={priceRange === 'medium'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">₹200 - ₹500</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="price"
                      value="high"
                      checked={priceRange === 'high'}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm text-muted-foreground">Above ₹500</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.checked)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="md:col-span-3">
          <div className="mb-4 text-muted-foreground text-sm">
            Showing {filteredProducts.length} products
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                <Link href={`/products/${product.id}`}>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                  </Link>
                  <div className="text-sm text-muted-foreground mb-3">{product.unit}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary text-lg">₹{product.price}</span>
                    <button
                      onClick={() => addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      })}
                      disabled={!product.stock}
                      className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                  {!product.stock && (
                    <div className="mt-2 text-xs text-destructive">Out of Stock</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
