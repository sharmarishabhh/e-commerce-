import Link from 'next/link';
import { ShoppingBag, Heart, Users, TrendingUp, Star } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const LandingPage = () => {
  const featuredProducts = [
    { id: '1', name: 'Pure A2 Cow Milk', price: 80, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', unit: '1L' },
    { id: '2', name: 'Desi Cow Ghee', price: 850, image: 'https://images.unsplash.com/photo-1628288789888-b4fa8e2e5759?w=400', unit: '500g' },
    { id: '3', name: 'Organic Cow Manure', price: 150, image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400', unit: '5kg' },
    { id: '4', name: 'Fresh Paneer', price: 200, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', unit: '250g' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar', text: 'The A2 milk quality is exceptional. Supporting a great cause!', rating: 5 },
    { name: 'Priya Sharma', text: 'Adopted a cow and it brings so much joy to contribute to their care.', rating: 5 },
    { name: 'Amit Patel', text: 'Fresh products delivered on time. Highly recommend!', rating: 5 },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-foreground">
                Support, Sustain, Serve
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join us in caring for our sacred cows while enjoying pure, organic products that nourish your family and support a noble cause.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Shop Products
                </Link>
                <Link
                  href="/donate"
                  className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Donate Now
                </Link>
                <Link
                  href="/adopt"
                  className="bg-accent text-accent-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Adopt a Cow
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800"
                  alt="Happy cows in the gaushala"
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-xl bg-background">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl mb-2">250+</div>
              <div className="text-sm text-muted-foreground">Cows Protected</div>
            </div>
            <div className="p-6 rounded-xl bg-background">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl mb-2">₹50L+</div>
              <div className="text-sm text-muted-foreground">Donations Received</div>
            </div>
            <div className="p-6 rounded-xl bg-background">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="p-6 rounded-xl bg-background">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Organic Products</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">Featured Products</h2>
            <p className="text-muted-foreground">Pure, organic products from our gaushala</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Link key={product.id} to={`/products/${product.id}`}>
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-foreground mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground text-sm">{product.unit}</span>
                      <span className="text-primary">₹{product.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-foreground">What Our Community Says</h2>
            <p className="text-muted-foreground">Trusted by thousands across India</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                <div className="text-foreground">- {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4">Make a Difference Today</h2>
          <p className="text-lg mb-8 opacity-90">
            Your support helps us provide food, shelter, and medical care to cows in need.
          </p>
          <Link
            href="/donate"
            className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Donate Now
          </Link>
        </div>
      </section>
    </div>
  );
};
