"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { confirmPaymentAction } from "@/lib/actions/payments.actions";
import { formatPrice } from "@/lib/format";

// Se carga una sola vez, fuera del componente, para que Stripe.js no se
// reinicialice en cada render. La llave publicable (pk_test_...) es pública
// por diseño, por eso sí lleva el prefijo NEXT_PUBLIC_.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const cardOptions = {
  hidePostalCode: true,
  style: {
    base: {
      fontSize: "16px",
      color: "#1b1d22",
      fontFamily: "Inter, sans-serif",
      "::placeholder": { color: "#63666f" },
    },
    invalid: { color: "#d64545" },
  },
};

type Props = {
  clientSecret: string;
  amount: string;
  onPaid: () => void;
};

function CardForm({ clientSecret, amount, onPaid }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Si Stripe ya cobró pero la API no pudo confirmarlo, guardamos el id para
  // reintentar SOLO la confirmación, sin volver a cobrarle al cliente.
  const [chargedIntentId, setChargedIntentId] = useState<string | null>(null);

  const confirmWithApi = async (intentId: string) => {
    const result = await confirmPaymentAction(intentId);
    if (result.status === "error") {
      setChargedIntentId(intentId);
      setError(
        `Tu tarjeta fue cobrada, pero no pudimos confirmarlo con el servidor: ${result.message}. Pulsa de nuevo para reintentar la confirmación.`
      );
      setBusy(false);
      return;
    }
    onPaid();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setBusy(true);
    setError(null);

    if (chargedIntentId) {
      await confirmWithApi(chargedIntentId);
      return;
    }

    const card = elements.getElement(CardElement);
    if (!card) {
      setBusy(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card },
    });

    if (stripeError) {
      // Aquí llegan los rechazos reales (tarjeta declinada, fondos, CVC...).
      setError(stripeError.message ?? "El pago fue rechazado por Stripe.");
      setBusy(false);
      return;
    }

    if (paymentIntent?.status !== "succeeded") {
      setError(`El pago no se completó (estado: ${paymentIntent?.status ?? "desconocido"}).`);
      setBusy(false);
      return;
    }

    await confirmWithApi(paymentIntent.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border-[3px] border-ink bg-white px-3 py-3">
        <CardElement options={cardOptions} />
      </div>

      <p className="text-xs text-ink-soft">
        Modo prueba: <span className="font-mono">4242 4242 4242 4242</span> aprueba,{" "}
        <span className="font-mono">4000 0000 0000 0002</span> rechaza. Usa cualquier fecha futura
        y cualquier CVC.
      </p>

      {error && (
        <p className="pixel-panel rounded-lg bg-danger px-4 py-3 text-sm text-white">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || busy}
        className="pixel-btn w-full rounded-lg bg-coin px-5 py-3 font-display text-xs text-ink hover:bg-coin-dark disabled:hover:bg-coin"
      >
        {busy
          ? "Procesando pago…"
          : chargedIntentId
            ? "Reintentar confirmación ▶"
            : `Pulsa START — Pagar ${formatPrice(amount)}`}
      </button>
    </form>
  );
}

export default function StripePaymentForm(props: Props) {
  if (!stripePromise) {
    return (
      <p className="pixel-panel rounded-lg bg-danger px-4 py-3 text-sm text-white">
        Falta NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en tu .env.local. Reinicia `npm run dev` después
        de agregarla.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ locale: "es" }}>
      <CardForm {...props} />
    </Elements>
  );
}
