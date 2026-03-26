"use client";

import Link from 'next/link';
import { ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navigation = () => {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 bg-card border-b border-border z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-semibold text-lg text-foreground">Gaushala</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <Link href="/donate" className="text-foreground hover:text-primary transition-colors">
              Donate
            </Link>
            <Link href="/adopt" className="text-foreground hover:text-primary transition-colors">
              Adopt a Cow
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors">
              <User className="w-6 h-6 text-foreground" />
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-border">
        <div className="flex justify-around py-2">
          <Link href="/products" className="px-3 py-2 text-sm text-foreground hover:text-primary">
            Products
          </Link>
          <Link href="/donate" className="px-3 py-2 text-sm text-foreground hover:text-primary">
            Donate
          </Link>
          <Link href="/adopt" className="px-3 py-2 text-sm text-foreground hover:text-primary">
            Adopt
          </Link>
        </div>
      </div>
    </nav>
  );
};
