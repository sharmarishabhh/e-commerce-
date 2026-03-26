'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ShoppingBag, ArrowRight, Tag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useCart } from '../context/CartContext';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}
interface RazorpayOptions {
  key: string; amount: number; currency: string; name: string;
  description: string; order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}
interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance { open(): void }

interface CouponState {
  applied: boolean; code: string; discountAmount: number;
  finalAmount: number; promoterName: string | null;
  discountType: string; discountValue: number; error?: string;
}

export const CartPage = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const deliveryFee = totalPrice > 500 ? 0 : 50;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl mb-4 text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Link href="/products" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl md:text-4xl mb-8 text-foreground">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-4 flex gap-4">
              <ImageWithFallback src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-foreground mb-1">{item.name}</h3>
                <div className="text-primary mb-3">Rs.{item.price}</div>
                <div className="flex items-center border border-border rounded-lg w-fit">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-muted transition-colors">-</button>
                  <span className="px-4 py-1 border-x border-border">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-muted transition-colors">+</button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end">
                <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:opacity-70"><Trash2 className="w-5 h-5" /></button>
                <div className="text-foreground">Rs.{item.price * item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
            <h2 className="text-xl mb-6 text-foreground">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Rs.{totalPrice}</span></div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `Rs.${deliveryFee}`}</span>
              </div>
              {deliveryFee > 0 && <div className="text-xs text-accent">Add Rs.{500 - totalPrice} more for free delivery</div>}
              <div className="border-t border-border pt-3 flex justify-between text-foreground text-lg">
                <span>Total</span><span>Rs.{totalPrice + deliveryFee}</span>
              </div>
            </div>
            <button onClick={() => setShowCheckout(true)} className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>
            <Link href="/products" className="block text-center text-primary hover:underline mt-4">Continue Shopping</Link>
          </div>
        </div>
      </div>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} subtotal={totalPrice} deliveryFee={deliveryFee} />}
    </div>
  );
};

const CheckoutModal = ({ onClose, subtotal, deliveryFee }: { onClose: () => void; subtotal: number; deliveryFee: number }) => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<'form' | 'paying' | 'done'>('form');
  const [loading, setLoading] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [coupon, setCoupon] = useState<CouponState | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '' });

  const baseAmount = subtotal + deliveryFee;
  const discountAmount = coupon?.applied ? coupon.discountAmount : 0;
  const finalAmount = baseAmount - discountAmount;

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCoupon(null);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), orderAmount: baseAmount }),
      });
      const data = await res.json();
      if (data.success && data.data.valid) {
        setCoupon({ ...data.data, applied: true, code: couponInput.trim().toUpperCase() });
      } else {
        setCoupon({ applied: false, code: couponInput.trim(), discountAmount: 0, finalAmount: baseAmount, promoterName: null, discountType: 'FLAT', discountValue: 0, error: data.data?.reason ?? 'Invalid coupon' });
      }
    } catch {
      setCoupon({ applied: false, code: '', discountAmount: 0, finalAmount: baseAmount, promoterName: null, discountType: 'FLAT', discountValue: 0, error: 'Could not validate coupon' });
    } finally {
      setCouponLoading(false);
    }
  };

  const loadRazorpay = (): Promise<boolean> => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          address: { line1: form.line1, line2: form.line2 || undefined, city: form.city, state: form.state, postalCode: form.postalCode },
          couponCode: coupon?.applied ? coupon.code : undefined,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error ?? 'Failed to create order');

      const { razorpayOrderId, internalOrderId, amount, keyId } = orderData.data;
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load payment gateway');

      setStep('paying');
      setLoading(false);

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Gaushala',
        description: 'Order Payment',
        order_id: razorpayOrderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#16a34a' },
        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              internalOrderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            setStep('done');
            setTimeout(() => { onClose(); router.push(`/order-success?orderId=${internalOrderId}`); }, 1500);
          } else {
            alert('Payment verification failed. Please contact support.');
            setStep('form');
          }
        },
        modal: { ondismiss: () => setStep('form') },
      });
      rzp.open();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
      setStep('form');
    }
  };

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const cls = "w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground";

  if (step === 'done') return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-12 text-center max-w-sm w-full">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground">Redirecting to your order...</p>
      </div>
    </div>
  );

  if (step === 'paying') return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-12 text-center max-w-sm w-full">
        <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
        <h2 className="text-xl text-foreground mb-2">Complete Payment</h2>
        <p className="text-muted-foreground text-sm">Complete the payment in the Razorpay window</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-2xl text-foreground">Checkout</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl">x</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div>
            <h3 className="text-foreground mb-4 font-medium">Your Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm mb-1 text-foreground">Full Name *</label><input required value={form.name} onChange={f('name')} className={cls} placeholder="Rajesh Kumar" /></div>
              <div><label className="block text-sm mb-1 text-foreground">Email *</label><input required type="email" value={form.email} onChange={f('email')} className={cls} placeholder="you@example.com" /></div>
              <div className="md:col-span-2"><label className="block text-sm mb-1 text-foreground">Phone *</label><input required value={form.phone} onChange={f('phone')} className={cls} placeholder="+91 98765 43210" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-4 font-medium">Delivery Address</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="block text-sm mb-1 text-foreground">Address Line 1 *</label><input required value={form.line1} onChange={f('line1')} className={cls} placeholder="House/Flat no, Street name" /></div>
              <div className="md:col-span-2"><label className="block text-sm mb-1 text-foreground">Address Line 2</label><input value={form.line2} onChange={f('line2')} className={cls} placeholder="Area, Landmark (optional)" /></div>
              <div><label className="block text-sm mb-1 text-foreground">City *</label><input required value={form.city} onChange={f('city')} className={cls} placeholder="Mumbai" /></div>
              <div><label className="block text-sm mb-1 text-foreground">State *</label><input required value={form.state} onChange={f('state')} className={cls} placeholder="Maharashtra" /></div>
              <div><label className="block text-sm mb-1 text-foreground">Pincode *</label><input required value={form.postalCode} onChange={f('postalCode')} className={cls} placeholder="400001" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-3 font-medium flex items-center gap-2"><Tag className="w-4 h-4" /> Have a coupon?</h3>
            <div className="flex gap-2">
              <input value={couponInput} onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCoupon(null); }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCoupon())} className={`${cls} flex-1 uppercase tracking-wider`} placeholder="Enter code e.g. PRIYA15" disabled={coupon?.applied} />
              {coupon?.applied ? (
                <button type="button" onClick={() => { setCoupon(null); setCouponInput(''); }} className="px-4 py-3 border border-border rounded-lg text-muted-foreground hover:bg-muted transition-colors">Remove</button>
              ) : (
                <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()} className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              )}
            </div>
            {coupon?.applied && (
              <div className="mt-2 flex items-center gap-2 text-sm text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span><strong>{coupon.code}</strong> applied — saving Rs.{coupon.discountAmount}{coupon.promoterName && <span className="text-muted-foreground"> · via {coupon.promoterName}</span>}</span>
              </div>
            )}
            {coupon && !coupon.applied && coupon.error && (
              <div className="mt-2 flex items-center gap-2 text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2">
                <XCircle className="w-4 h-4 shrink-0" /><span>{coupon.error}</span>
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Rs.{subtotal}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `Rs.${deliveryFee}`}</span></div>
            {coupon?.applied && <div className="flex justify-between text-primary"><span>Discount ({coupon.code})</span><span>- Rs.{coupon.discountAmount}</span></div>}
            <div className="flex justify-between text-foreground text-xl pt-2 border-t border-border"><span>Total</span><span>Rs.{finalAmount}</span></div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 bg-muted text-foreground py-3 rounded-lg hover:opacity-90 transition-opacity">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Pay Rs.{finalAmount}
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">Secured by Razorpay · UPI · Cards · Net Banking</p>
        </form>
      </div>
    </div>
  );
};
