"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CarritoPage() {
  const { lines, removeItem, updateQuantity, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <div className="pixel-panel rounded-xl px-6 py-16 text-center">
        <p className="font-display text-sm text-ink">¡Inventario vacío! 🎒</p>
        <p className="mt-2 text-sm text-ink-soft">Todavía no has recogido ningún ítem.</p>
        <Link href="/" className="mt-5 inline-block font-display text-xs text-sky-deep">
          Ir al catálogo →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-lg text-ink sm:text-2xl">Mochila de ítems</h1>

      <ul className="pixel-panel divide-y-[3px] divide-ink rounded-xl">
        {lines.map((l) => (
          <li key={l.product.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-medium text-ink">{l.product.name}</p>
              <p className="text-xs text-coin-dark">🪙 {formatPrice(l.product.price)} c/u</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                max={l.product.stock}
                value={l.quantity}
                onChange={(e) => updateQuantity(l.product.id, Number(e.target.value))}
                className="w-16 rounded-lg border-[3px] border-ink px-2 py-1 text-sm"
              />
              <button
                onClick={() => removeItem(l.product.id)}
                className="text-xs text-danger hover:underline"
              >
                Soltar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pixel-panel flex items-center justify-between rounded-xl p-5">
        <span className="font-display text-xs text-ink">Puntaje total</span>
        <span className="font-display text-sm text-coin-dark">🪙 {formatPrice(totalPrice)}</span>
      </div>

      <Link
        href="/checkout"
        className="pixel-btn block w-full rounded-lg bg-pipe px-5 py-3 text-center font-display text-xs text-white hover:bg-pipe-dark"
      >
        Pulsa START ▶
      </Link>
    </div>
  );
}
