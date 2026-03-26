'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const params = useSearchParams();
  const orderId = params.get('orderId');

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-card border border-border rounded-2xl p-12">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl text-foreground mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. Your order has been placed and payment received.
        </p>

        {orderId && (
          <div className="bg-muted/40 rounded-xl px-6 py-4 mb-8 text-left">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Package className="w-4 h-4" />
              <span>Order ID</span>
            </div>
            <div className="text-foreground font-mono text-sm break-all">{orderId}</div>
          </div>
        )}

        <div className="space-y-3 mb-8 text-left text-sm text-muted-foreground bg-muted/20 rounded-xl p-5">
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>You will receive a confirmation on your email shortly</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>Delivery typically takes 1–3 business days</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>For any queries, please contact support with your order ID</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3 rounded-lg hover:bg-muted transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
