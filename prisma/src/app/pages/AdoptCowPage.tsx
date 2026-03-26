'use client';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const cows = [
  {
    id: '1',
    name: 'Kamdhenu',
    age: '5 years',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
    story: 'Kamdhenu came to us after being rescued from the streets. She is gentle and loving, and enjoys spending time with visitors.',
    monthlyCost: 3000,
    breed: 'Gir',
  },
  {
    id: '2',
    name: 'Gauri',
    age: '3 years',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
    story: 'Gauri is a young cow who loves playing in the fields. She is very social and has made many friends at the gaushala.',
    monthlyCost: 2500,
    breed: 'Sahiwal',
  },
  {
    id: '3',
    name: 'Nandini',
    age: '7 years',
    image: 'https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800',
    story: 'Nandini is a calm and wise cow. She was brought to us by a kind farmer and now serves as a mother figure to younger cows.',
    monthlyCost: 3500,
    breed: 'Red Sindhi',
  },
  {
    id: '4',
    name: 'Lakshmi',
    age: '4 years',
    image: 'https://images.unsplash.com/photo-1529323871863-75303b1e2f29?w=800',
    story: 'Lakshmi is a beautiful cow with a golden coat. She loves fresh grass and enjoys the company of children who visit the gaushala.',
    monthlyCost: 2800,
    breed: 'Gir',
  },
  {
    id: '5',
    name: 'Radha',
    age: '6 years',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    story: 'Radha is a gentle soul who was found injured on the highway. After months of care, she has fully recovered and thrives at the gaushala.',
    monthlyCost: 3200,
    breed: 'Sahiwal',
  },
  {
    id: '6',
    name: 'Shyama',
    age: '2 years',
    image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800',
    story: 'Shyama is the youngest at our gaushala. She is playful and curious, always exploring new areas and making everyone smile.',
    monthlyCost: 2000,
    breed: 'Red Sindhi',
  },
];

export const AdoptCowPage = () => {
  const [adoptedCows, setAdoptedCows] = useState<Set<string>>(new Set());

  const handleAdopt = (cowId: string) => {
    setAdoptedCows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cowId)) {
        newSet.delete(cowId);
      } else {
        newSet.add(cowId);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl mb-4 text-foreground">Adopt a Cow</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Sponsor the care of a cow and receive regular updates about their well-being. Your monthly contribution ensures they receive proper food, shelter, and medical care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cows.map((cow) => {
          const isAdopted = adoptedCows.has(cow.id);
          return (
            <div key={cow.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <ImageWithFallback
                src={cow.image}
                alt={cow.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl text-foreground mb-1">{cow.name}</h3>
                    <div className="text-sm text-muted-foreground">{cow.breed} • {cow.age}</div>
                  </div>
                  <Heart
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      isAdopted ? 'text-primary fill-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
                    onClick={() => handleAdopt(cow.id)}
                  />
                </div>

                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{cow.story}</p>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Monthly sponsorship:</span>
                    <span className="text-foreground">₹{cow.monthlyCost}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAdopt(cow.id)}
                  className={`w-full py-3 rounded-lg transition-all ${
                    isAdopted
                      ? 'bg-secondary text-secondary-foreground hover:opacity-90'
                      : 'bg-primary text-primary-foreground hover:opacity-90'
                  }`}
                >
                  {isAdopted ? 'Adopted ❤️' : 'Adopt Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-muted/30 rounded-xl p-8">
        <h2 className="text-2xl mb-6 text-center text-foreground">What You Get</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-foreground mb-2">Monthly Updates</h3>
            <p className="text-sm text-muted-foreground">
              Receive photos and updates about your adopted cow's health and happiness
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-foreground mb-2">Visit Anytime</h3>
            <p className="text-sm text-muted-foreground">
              Visit the gaushala and spend time with your adopted cow whenever you want
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-foreground mb-2">Impact Certificate</h3>
            <p className="text-sm text-muted-foreground">
              Receive a personalized adoption certificate with your cow's details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
