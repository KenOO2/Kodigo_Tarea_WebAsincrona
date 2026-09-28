// ── Errores ──────────────────────────────────────────────────────────────
export type ApiErrorBody = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};

// ── Paginación ───────────────────────────────────────────────────────────
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  total: number;
};

// ── Productos ────────────────────────────────────────────────────────────
export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string; // decimal(10,2) -> Laravel lo serializa como string, ej "49.99"
  stock: number;
  sku: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductListResponse = {
  success: true;
  data: Product[];
  meta: PaginationMeta;
};

export type ProductDetailResponse = {
  success: true;
  data: Product;
};

// ── Auth ─────────────────────────────────────────────────────────────────
// SUPUESTO: ajusta estos campos si tu respuesta real de /auth/login difiere.
export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
};

export type AuthResponse = {
  success: true;
  data: {
    access_token: string;
    token_type: string;
    user: User;
  };
};

// ── Órdenes ──────────────────────────────────────────────────────────────
// SUPUESTO: cuerpo esperado por POST /orders. Ajusta si tu API usa otros nombres.
export type OrderItemInput = {
  product_id: number;
  quantity: number;
};

// SUPUESTO: forma de cada item dentro de una orden ya creada.
export type OrderItem = {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: string;
  subtotal: string;
};

// SUPUESTO: forma de una orden devuelta por la API.
export type Order = {
  id: number;
  status: string;
  total: string;
  items: OrderItem[];
  created_at: string;
};

export type OrderListResponse = {
  success: true;
  data: Order[];
  meta: PaginationMeta;
};

export type OrderDetailResponse = {
  success: true;
  data: Order;
};

// ── Pagos ────────────────────────────────────────────────────────────────
// Forma documentada por la API para POST /payments/create-intent y /payments/confirm.
export type Payment = {
  id: number;
  order_id: number;
  stripe_payment_intent_id: string;
  stripe_client_secret: string;
  amount: string;
  currency: string;
  status: string;
};

export type PaymentResponse = {
  success: true;
  message?: string;
  data: Payment;
};
