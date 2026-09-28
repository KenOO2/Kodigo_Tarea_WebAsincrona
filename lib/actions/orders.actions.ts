"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { apiFetch, ApiError } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { Order, OrderItemInput } from "@/lib/types";

export type CreateOrderState =
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success"; order: Order };

export async function createOrderAction(items: OrderItemInput[]): Promise<CreateOrderState> {
  const token = await getToken();
  if (!token) {
    return { status: "error", message: "Debes iniciar sesión para completar la compra." };
  }
  if (items.length === 0) {
    return { status: "error", message: "Tu carrito está vacío." };
  }

  try {
    const res = await apiFetch<{ success: true; data: Order }>("/orders", {
      method: "POST",
      token,
      body: JSON.stringify({ items }),
    });

    // Evita que /historial muestre datos desactualizados tras crear la orden.
    revalidateTag("orders", "max");
    revalidatePath("/historial");

    return { status: "success", order: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      // El JWT de tymon/jwt-auth expira (por defecto a los 60 min) aunque la
      // cookie siga viva, así que un 401 aquí casi siempre es sesión vencida.
      if (err.status === 401) {
        return { status: "error", message: "Tu sesión expiró. Cierra sesión e ingresa de nuevo." };
      }
      return { status: "error", message: err.body.message, fieldErrors: err.body.errors };
    }
    // Aparece en la terminal donde corre `npm run dev`.
    console.error("[createOrderAction] error inesperado:", err);
    return { status: "error", message: "No se pudo crear la orden. Intenta de nuevo." };
  }
}
