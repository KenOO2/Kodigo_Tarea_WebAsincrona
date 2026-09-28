import { apiFetch } from "./api";
import { getToken } from "./session";
import type { OrderListResponse, OrderDetailResponse } from "./types";

export async function getMyOrders() {
  const token = await getToken();
  if (!token) {
    return {
      success: true as const,
      data: [],
      meta: { current_page: 1, last_page: 1, total: 0 },
    };
  }

  // Datos propios del usuario: sin caché entre usuarios distintos,
  // pero sí invalidable por tag tras crear una orden.
  return apiFetch<OrderListResponse>("/orders", {
    token,
    cache: "no-store",
    next: { tags: ["orders"] },
  });
}

export async function getOrder(id: number | string) {
  const token = await getToken();
  return apiFetch<OrderDetailResponse>(`/orders/${id}`, {
    token,
    cache: "no-store",
    next: { tags: ["orders", `order-${id}`] },
  });
}
