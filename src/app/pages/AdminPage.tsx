import { useState } from 'react';
import { Package, Heart, ShoppingBag, TrendingUp, Edit, Trash2 } from 'lucide-react';

const mockProducts = [
  { id: '1', name: 'Pure A2 Cow Milk', price: 80, stock: 50, category: 'Dairy' },
  { id: '2', name: 'Desi Cow Ghee', price: 850, stock: 25, category: 'Dairy' },
  { id: '3', name: 'Organic Cow Manure', price: 150, stock: 100, category: 'Organic' },
  { id: '4', name: 'Fresh Paneer', price: 200, stock: 30, category: 'Dairy' },
];

const mockOrders = [
  { id: 'ORD001', customer: 'Rajesh Kumar', date: '2026-03-24', total: 1130, status: 'Pending' },
  { id: 'ORD002', customer: 'Priya Sharma', date: '2026-03-23', total: 280, status: 'Shipped' },
  { id: 'ORD003', customer: 'Amit Patel', date: '2026-03-22', total: 850, status: 'Delivered' },
  { id: 'ORD004', customer: 'Anita Desai', date: '2026-03-21', total: 450, status: 'Pending' },
];

const mockDonations = [
  { id: 'DON001', donor: 'Vikram Singh', amount: 5000, date: '2026-03-24', type: 'One-time' },
  { id: 'DON002', donor: 'Meera Krishnan', amount: 500, date: '2026-03-23', type: 'Monthly' },
  { id: 'DON003', donor: 'Suresh Rao', amount: 1500, date: '2026-03-22', type: 'One-time' },
];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'donations'>('overview');

  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDonations = mockDonations.reduce((sum, donation) => sum + donation.amount, 0);
  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl mb-8 text-foreground">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground text-sm">Total Products</span>
          </div>
          <div className="text-2xl text-foreground">{mockProducts.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-accent" />
            <span className="text-muted-foreground text-sm">Pending Orders</span>
          </div>
          <div className="text-2xl text-foreground">{pendingOrders}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-secondary" />
            <span className="text-muted-foreground text-sm">Revenue</span>
          </div>
          <div className="text-2xl text-foreground">₹{totalRevenue}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            <span className="text-muted-foreground text-sm">Donations</span>
          </div>
          <div className="text-2xl text-foreground">₹{totalDonations}</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 px-6 py-4 transition-colors ${
              activeTab === 'products'
                ? 'bg-primary/10 text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            Products
          </button>
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
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-foreground text-sm">New order from Rajesh Kumar</div>
                        <div className="text-xs text-muted-foreground">2 hours ago</div>
                      </div>
                    </div>
                    <span className="text-foreground">₹1,130</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-secondary" />
                      <div>
                        <div className="text-foreground text-sm">Donation from Vikram Singh</div>
                        <div className="text-xs text-muted-foreground">5 hours ago</div>
                      </div>
                    </div>
                    <span className="text-foreground">₹5,000</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <div className="text-foreground text-sm">Order shipped to Priya Sharma</div>
                        <div className="text-xs text-muted-foreground">1 day ago</div>
                      </div>
                    </div>
                    <span className="text-foreground">₹280</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-foreground mb-4">Quick Stats</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Average Order Value</div>
                    <div className="text-2xl text-foreground">₹{Math.round(totalRevenue / mockOrders.length)}</div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Total Customers</div>
                    <div className="text-2xl text-foreground">156</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-foreground">Product Management</h3>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                  Add Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-4 text-muted-foreground text-sm">Product</th>
                      <th className="text-left py-3 px-4 text-muted-foreground text-sm">Category</th>
                      <th className="text-left py-3 px-4 text-muted-foreground text-sm">Price</th>
                      <th className="text-left py-3 px-4 text-muted-foreground text-sm">Stock</th>
                      <th className="text-left py-3 px-4 text-muted-foreground text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30">
                        <td className="py-3 px-4 text-foreground">{product.name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                        <td className="py-3 px-4 text-foreground">₹{product.price}</td>
                        <td className="py-3 px-4 text-muted-foreground">{product.stock}</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded transition-colors">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-foreground mb-6">Order Management</h3>
              <div className="space-y-4">
                {mockOrders.map((order) => (
                  <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-foreground mb-1">Order {order.id}</div>
                        <div className="text-sm text-muted-foreground">{order.customer} • {order.date}</div>
                      </div>
                      <select
                        defaultValue={order.status}
                        className="px-3 py-1 border border-border rounded-lg text-sm bg-background"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="text-foreground">₹{order.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'donations' && (
            <div>
              <h3 className="text-foreground mb-6">Donation Overview</h3>
              <div className="space-y-4">
                {mockDonations.map((donation) => (
                  <div key={donation.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-foreground mb-1">{donation.donor}</div>
                        <div className="text-sm text-muted-foreground">{donation.date} • {donation.type}</div>
                      </div>
                      <div className="text-primary text-lg">₹{donation.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
