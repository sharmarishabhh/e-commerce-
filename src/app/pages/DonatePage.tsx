'use client';
import { useState } from 'react';
import { Heart, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export const DonatePage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const presetAmounts = [
    { amount: 250, description: 'Feed a cow for a day' },
    { amount: 500, description: 'One week of cow care' },
    { amount: 1500, description: 'One month of cow care' },
    { amount: 5000, description: 'Medical care fund' },
  ];

  const handleDonate = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const donationAmount = selectedAmount === null ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <h1 className="text-3xl md:text-4xl mb-4 text-foreground">Make a Difference</h1>
          <p className="text-muted-foreground mb-6">
            Your donation helps us provide food, shelter, medical care, and love to cows in need. Every contribution makes a real impact.
          </p>

          <div className="rounded-2xl overflow-hidden mb-6">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
              alt="Cows at the gaushala"
              className="w-full h-[300px] object-cover"
            />
          </div>

          <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
            <h3 className="text-foreground mb-4">Your Impact</h3>
            <div className="space-y-3 text-muted-foreground text-sm">
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>₹250 provides nutritious food for one cow for an entire day</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>₹500 covers weekly care including food and basic health checkups</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>₹1500 ensures comprehensive monthly care for one cow</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>₹5000 helps build our medical care fund for emergencies</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky top-24">
          <div className="bg-card border border-border rounded-xl p-8">
            <h2 className="text-2xl mb-6 text-foreground">Choose Donation Amount</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.amount}
                  onClick={() => {
                    setSelectedAmount(preset.amount);
                    setCustomAmount('');
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAmount === preset.amount
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-xl text-foreground mb-1">₹{preset.amount}</div>
                  <div className="text-xs text-muted-foreground">{preset.description}</div>
                </button>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-foreground">Custom Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 mb-6 p-4 bg-muted/30 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="accent-primary w-5 h-5"
              />
              <div>
                <div className="text-foreground text-sm">Make this a monthly donation</div>
                <div className="text-xs text-muted-foreground">Help us plan better with recurring support</div>
              </div>
            </label>

            <div className="border-t border-border pt-6 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Donation Amount:</span>
                <span className="text-foreground">₹{donationAmount}</span>
              </div>
              {isRecurring && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Recurring monthly</span>
                  <Heart className="w-4 h-4" />
                </div>
              )}
            </div>

            <button
              onClick={handleDonate}
              disabled={donationAmount <= 0}
              className="w-full bg-primary text-primary-foreground py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Donate Now
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Your donation is 100% secure. All contributions are tax-deductible.
            </p>
          </div>

          {showSuccess && (
            <div className="mt-4 bg-primary text-primary-foreground p-4 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>Thank you for your generous donation!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
