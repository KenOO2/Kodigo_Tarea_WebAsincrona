"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-store";
import { createOrderAction } from "@/lib/actions/orders.actions";
import { createPaymentIntentAction } from "@/lib/actions/payments.actions";
import { formatPrice } from "@/lib/format";
import StripePaymentForm from "@/components/ui/StripePaymentForm";
import type { Order, Payment } from "@/lib/types";

export default function CheckoutPage() {
  const { lines, totalPrice, clear } = useCart();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Con orden ya creada no mostramos "carrito vacío" aunque el carrito se
  // limpie justo antes de navegar a la confirmación.
  if (lines.length === 0 && !order) {
    return (
      <div className="pixel-panel rounded-xl px-6 py-16 text-center">
        <p className="font-display text-sm text-ink">¡Inventario vacío! 🎒</p>
        <p className="mt-2 text-sm text-ink-soft">
          Recoge ítems del catálogo antes de pulsar START.
        </p>
      </div>
    );
  }

  // Paso 1 y 2: crear la orden (solo si aún no existe) y luego el
  // PaymentIntent. Si el intent falla, la orden queda guardada en `order` y
  // el reintento NO crea una orden duplicada.
  const handleStart = () => {
    setErrorMsg(null);
    startTransition(async () => {
      let current = order;

      if (!current) {
        const items = lines.map((l) => ({ product_id: l.product.id, quantity: l.quantity }));
        const created = await createOrderAction(items);
        if (created.status === "error") {
          setErrorMsg(created.message);
          return;
        }
        current = created.order;
        setOrder(current);
      }

      const intent = await createPaymentIntentAction(current.id);
      if (intent.status === "error") {
        setErrorMsg(intent.message);
        return;
      }
      setPayment(intent.payment);
    });
  };

  const handlePaid = () => {
    if (!order) return;
    clear();
    router.push(`/checkout/confirmacion/${order.id}`);
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="font-display text-lg text-ink sm:text-2xl">Checkout — Boss Level</h1>

      <div className="pixel-panel rounded-xl p-5">
        <ul className="divide-y-[3px] divide-ink">
          {lines.map((l) => (
            <li key={l.product.id} className="flex justify-between py-2 text-sm">
              <span>
                {l.product.name} × {l.quantity}
              </span>
              <span>{formatPrice(Number(l.product.price) * l.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t-[3px] border-ink pt-3 font-display text-xs">
          <span>Total</span>
          <span className="text-coin-dark">🪙 {formatPrice(totalPrice)}</span>
        </div>
      </div>

      {errorMsg && (
        <p className="pixel-panel rounded-lg bg-danger px-4 py-3 text-sm text-white">{errorMsg}</p>
      )}

      {!payment && (
        <button
          onClick={handleStart}
          disabled={isPending}
          className="pixel-btn w-full rounded-lg bg-pipe px-5 py-3 font-display text-xs text-white hover:bg-pipe-dark disabled:hover:bg-pipe"
        >
          {isPending
            ? "Guardando partida…"
            : order
              ? "Reintentar pago ▶"
              : "Crear orden y pagar ▶"}
        </button>
      )}

      {payment && order && (
        <div className="pixel-panel space-y-4 rounded-xl p-5">
          <p className="text-sm text-ink-soft">
            Orden <span className="font-mono text-ink">#{order.id}</span> creada. Ingresa los datos
            de tu tarjeta:
          </p>

          <StripePaymentForm
            clientSecret={payment.stripe_client_secret}
            amount={payment.amount}
            onPaid={handlePaid}
          />
        </div>
      )}
    </div>
  );
}
