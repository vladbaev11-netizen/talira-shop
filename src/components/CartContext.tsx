"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  oldPrice?: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  showNotification: boolean;
  notificationText: string;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("talira-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem("talira-cart", JSON.stringify(items));
  }, [items, loaded]);

  function addItem(item: Omit<CartItem, "quantity">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === item.slug);
      if (existing) return prev.map((i) => i.slug === item.slug ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...item, quantity: qty }];
    });
    setNotificationText(item.name);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }

  function removeItem(slug: string) { setItems((prev) => prev.filter((i) => i.slug !== slug)); }

  function updateQuantity(slug: string, qty: number) {
    if (qty < 1) return removeItem(slug);
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, quantity: qty } : i)));
  }

  function clearCart() { setItems([]); }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, showNotification, notificationText }}>
      {children}
    </CartContext.Provider>
  );
}
