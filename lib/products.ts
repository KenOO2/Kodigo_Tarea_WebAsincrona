import { apiFetch } from "./api";
import type { Product, ProductListResponse, ProductDetailResponse, PaginationMeta } from "./types";

// La API documentó dos formas distintas de paginar /products durante el
// desarrollo de este proyecto:
//   A) { success, data: Product[], meta: {...} }            <- formato "oficial"
//   B) { success, data: { data: Product[], current_page,... } } <- paginate() crudo de Laravel
// Para no depender de cuál esté realmente desplegada, normalizamos las dos.
function normalizeProductList(raw: unknown): { data: Product[]; meta: PaginationMeta } {
  const payload = raw as {
    data: Product[] | { data: Product[]; current_page: number; last_page: number; total: number };
    meta?: PaginationMeta;
  };

  if (Array.isArray(payload.data)) {
    return {
      data: payload.data,
      meta: payload.meta ?? { current_page: 1, last_page: 1, total: payload.data.length },
    };
  }

  // Formato anidado (paginate() de Laravel sin transformar).
  const nested = payload.data;
  return {
    data: nested.data,
    meta: {
      current_page: nested.current_page,
      last_page: nested.last_page,
      total: nested.total,
    },
  };
}

export async function getProducts(params?: { search?: string; page?: number }) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.page) qs.set("page", String(params.page));
  const query = qs.toString() ? `?${qs.toString()}` : "";

  const raw = await apiFetch<unknown>(`/products${query}`, {
    next: { tags: ["products"], revalidate: 60 },
  });

  return normalizeProductList(raw) satisfies { data: Product[]; meta: PaginationMeta };
}

export async function getProduct(id: number | string) {
  return apiFetch<ProductDetailResponse>(`/products/${id}`, {
    next: { tags: ["products", `product-${id}`], revalidate: 60 },
  });
}
