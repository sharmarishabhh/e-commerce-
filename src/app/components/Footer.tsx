import { Heart, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-semibold text-foreground">Gaushala</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting cow welfare through sustainable products and compassionate care.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-muted-foreground hover:text-primary">
                Products
              </Link>
              <Link href="/donate" className="block text-sm text-muted-foreground hover:text-primary">
                Donate
              </Link>
              <Link href="/adopt" className="block text-sm text-muted-foreground hover:text-primary">
                Adopt a Cow
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>contact@gaushala.org</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Our Mission</h3>
            <p className="text-sm text-muted-foreground">
              Every purchase and donation helps us care for our cows with love, dignity, and respect.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Gaushala. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
