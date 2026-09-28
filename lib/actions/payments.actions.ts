"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { Payment, PaymentResponse } from "@/lib/types";

export type PaymentActionState =
  | { status: "error"; message: string }
  | { status: "success"; payment: Payment };

function toErrorState(err: unknown, fallback: string): PaymentActionState {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return { status: "error", message: "Tu sesión expiró. Cierra sesión e ingresa de nuevo." };
    }
    return { status: "error", message: err.body.message };
  }
  console.error("[payments.actions] error inesperado:", err);
  return { status: "error", message: fallback };
}

// Paso 1: la API crea el PaymentIntent en Stripe y nos devuelve el
// client_secret. Ese secret SÍ puede viajar al navegador: está diseñado
// para que Stripe.js cobre la tarjeta. Lo que nunca debe llegar al
// navegador es la llave secreta (sk_test_...), que vive solo en el backend.
export async function createPaymentIntentAction(orderId: number): Promise<PaymentActionState> {
  const token = await getToken();
  if (!token) {
    return { status: "error", message: "Debes iniciar sesión para pagar." };
  }

  try {
    const res = await apiFetch<PaymentResponse>("/payments/create-intent", {
      method: "POST",
      token,
      body: JSON.stringify({ order_id: orderId }),
    });
    return { status: "success", payment: res.data };
  } catch (err) {
    return toErrorState(err, "No se pudo iniciar el pago. Intenta de nuevo.");
  }
}

// Paso 3: después de que Stripe.js cobró, la API consulta a Stripe y, si el
// estado es succeeded, marca la orden como pagada. Aquí invalidamos el
// historial para que no muestre la orden como pendiente.
export async function confirmPaymentAction(paymentIntentId: string): Promise<PaymentActionState> {
  const token = await getToken();
  if (!token) {
    return { status: "error", message: "Debes iniciar sesión para pagar." };
  }

  try {
    const res = await apiFetch<PaymentResponse>("/payments/confirm", {
      method: "POST",
      token,
      body: JSON.stringify({ payment_intent_id: paymentIntentId }),
    });

    revalidateTag("orders", "max");
    revalidatePath("/historial");

    return { status: "success", payment: res.data };
  } catch (err) {
    return toErrorState(err, "No se pudo confirmar el pago con el servidor.");
  }
}
