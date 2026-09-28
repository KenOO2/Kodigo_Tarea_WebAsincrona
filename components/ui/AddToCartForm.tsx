"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";

export default function AddToCartForm({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock <= 0;

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min={1}
        max={product.stock}
        value={quantity}
        disabled={outOfStock}
        onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
        className="w-20 rounded-lg border-[3px] border-ink px-3 py-2 text-sm disabled:opacity-50"
      />
      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          addItem(product, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="pixel-btn rounded-lg bg-pipe px-6 py-2.5 font-display text-[11px] text-white hover:bg-pipe-dark disabled:hover:bg-pipe sm:text-xs"
      >
        {added ? "¡+1 ítem! 🪙" : outOfStock ? "Game Over" : "Recoger ítem"}
      </button>
    </div>
  );
}
