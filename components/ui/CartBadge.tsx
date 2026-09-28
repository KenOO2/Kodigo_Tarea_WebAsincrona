"use client";

import { useCart } from "@/lib/cart-store";

export default function CartBadge() {
  const { totalItems } = useCart();

  return (
    <span className="inline-flex items-center gap-1.5">
      Ítems
      {totalItems > 0 && (
        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-display text-white">
          {totalItems}
        </span>
      )}
    </span>
  );
}
