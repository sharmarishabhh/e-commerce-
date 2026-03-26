"use client";

import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    <CartProvider>
      <div />
    </CartProvider>
  );
}