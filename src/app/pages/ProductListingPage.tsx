'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Filter, ShoppingCart, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: { id: string; name: string; slug: string };
}

export const ProductListingPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products?limit=100');
        const data = await res.json();
        if (!data.success) throw new Error(data.error ?? 'Failed to load products');
        setProducts(data.data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive unique category slugs from live data
  const categories = Array.from(new Set(products.map(p => p.category.slug)))
    .map(slug => ({ slug, name: products.find(p => p.category.slug === slug)!.category.name }));

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) return false;
    if (availabilityFilter && product.stock <= 0) return false;
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
                    <input type="radio" name="category" value="all" checked={selectedCategory === 'all'} onChange={e => setSelectedCategory(e.target.value)} className="accent-primary" />
                    <span className="text-sm text-muted-foreground">All Products</span>
                  </label>
                  {categories.map(cat => (
                    <label key={cat.slug} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" value={cat.slug} checked={selectedCategory === cat.slug} onChange={e => setSelectedCategory(e.target.value)} className="accent-primary" />
                      <span className="text-sm text-muted-foreground">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="block text-sm mb-3 text-foreground">Price Range</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Prices' },
                    { value: 'low', label: 'Under ₹200' },
                    { value: 'medium', label: '₹200 - ₹500' },
                    { value: 'high', label: 'Above ₹500' },
                  ].map(opt => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" value={opt.value} checked={priceRange === opt.value} onChange={e => setPriceRange(e.target.value)} className="accent-primary" />
                      <span className="text-sm text-muted-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={availabilityFilter} onChange={e => setAvailabilityFilter(e.target.checked)} className="accent-primary" />
                  <span className="text-sm text-foreground">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        <div className="md:col-span-3">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <button onClick={() => window.location.reload()} className="text-primary hover:underline">Try again</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="mb-4 text-muted-foreground text-sm">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                    <Link href={`/products/${product.slug}`}>
                      <ImageWithFallback
                        src={product.imageUrl ?? ''}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-foreground mb-1 hover:text-primary transition-colors">{product.name}</h3>
                      </Link>
                      <div className="text-sm text-muted-foreground mb-3">{product.category.name}</div>
                      <div className="flex justify-between items-center">
                        <span className="text-primary text-lg">₹{product.price}</span>
                        <button
                          onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.imageUrl ?? '',
                          })}
                          disabled={product.stock <= 0}
                          className="bg-primary text-primary-foreground p-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                      {product.stock <= 0 && (
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};