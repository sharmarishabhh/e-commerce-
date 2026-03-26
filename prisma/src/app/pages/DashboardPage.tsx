'use client';
import { useState } from 'react';
import { Package, Heart, Users, User } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const mockOrders = [
  { id: 'ORD001', date: '2026-03-20', items: 3, total: 1130, status: 'Delivered' },
  { id: 'ORD002', date: '2026-03-15', items: 2, total: 280, status: 'In Transit' },
  { id: 'ORD003', date: '2026-03-10', items: 1, total: 850, status: 'Delivered' },
];

const mockDonations = [
  { id: 'DON001', date: '2026-03-22', amount: 500, type: 'One-time' },
  { id: 'DON002', date: '2026-02-22', amount: 500, type: 'Monthly' },
  { id: 'DON003', date: '2026-01-22', amount: 500, type: 'Monthly' },
];

const mockAdoptedCows = [
  {
    id: '1',
    name: 'Kamdhenu',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    adoptedOn: '2026-01-15',
    monthlyCost: 3000,
  },
  {
    id: '2',
    name: 'Gauri',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
    adoptedOn: '2026-02-20',
    monthlyCost: 2500,
  },
];

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'donations' | 'adopted' | 'profile'>('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl mb-8 text-foreground">My Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground text-sm">Total Orders</span>
          </div>
          <div className="text-2xl text-foreground">{mockOrders.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-secondary" />
            <span className="text-muted-foreground text-sm">Donations</span>
          </div>
          <div className="text-2xl text-foreground">₹{mockDonations.reduce((sum, d) => sum + d.amount, 0)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground text-sm">Adopted Cows</span>
          </div>
          <div className="text-2xl text-foreground">{mockAdoptedCows.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            <span className="text-muted-foreground text-sm">Impact Score</span>
          </div>
          <div className="text-2xl text-foreground">850</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'orders'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'donations'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Donations
          </button>
          <button
            onClick={() => setActiveTab('adopted')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'adopted'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Adopted Cows
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'profile'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Profile
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-foreground mb-1">Order {order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      order.status === 'Delivered'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent/10 text-accent'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{order.items} items</span>
                    <span className="text-foreground">₹{order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'donations' && (
            <div className="space-y-4">
              {mockDonations.map((donation) => (
                <div key={donation.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-foreground mb-1">{donation.type} Donation</div>
                      <div className="text-sm text-muted-foreground">{donation.date}</div>
                    </div>
                    <div className="text-primary">₹{donation.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'adopted' && (
            <div className="grid md:grid-cols-2 gap-6">
              {mockAdoptedCows.map((cow) => (
                <div key={cow.id} className="border border-border rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={cow.image}
                    alt={cow.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-foreground mb-2">{cow.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      Adopted on {cow.adoptedOn}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Monthly: ₹{cow.monthlyCost}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl text-foreground mb-1">Rajesh Kumar</h3>
                  <div className="text-sm text-muted-foreground">rajesh.kumar@example.com</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2 text-foreground">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Rajesh Kumar"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Email</label>
                  <input
                    type="email"
                    defaultValue="rajesh.kumar@example.com"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+91 98765 43210"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-foreground">Address</label>
                  <textarea
                    defaultValue="Mumbai, Maharashtra, 400001"
                    rows={3}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
