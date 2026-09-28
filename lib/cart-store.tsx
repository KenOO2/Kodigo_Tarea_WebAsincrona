"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "./types";

export type CartLine = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Carga inicial desde localStorage (solo corre en el navegador).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // localStorage no disponible o dato corrupto: arrancamos con carrito vacío.
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persiste cada cambio, ya hidratado.
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Almacenamiento lleno o no disponible: no rompemos la app por esto.
    }
  }, [lines, hydrated]);

  const addItem = (product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product.id === product.id);
      if (existing) {
        return prev.map((l) =>
          l.product.id === product.id
            ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) }
            : l
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeItem = (productId: number) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === productId ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0)
    );
  };

  const clear = () => setLines([]);

  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalPrice = lines.reduce(
    (sum, l) => sum + Number(l.product.price) * l.quantity,
    0
  );

  const value = useMemo(
    () => ({ lines, addItem, removeItem, updateQuantity, clear, totalItems, totalPrice }),
    [lines, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
