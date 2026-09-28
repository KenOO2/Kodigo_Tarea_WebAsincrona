# Frontend E-commerce — Next.js 16 (App Router)

Frontend que consume la API REST de e-commerce (Laravel 12 + JWT + Stripe) construida
previamente. Implementa catálogo público, autenticación, carrito, checkout con pago vía
Stripe (modo test) e historial de compras, con énfasis en rendimiento (Server Components,
Suspense, `loading.tsx`/`error.tsx`) y mutaciones seguras vía Server Actions.

## API Ecommerce
- Link: https://github.com/KenOO2/Kodigo_Tarea_APIecommerce
## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Server Components para lecturas, Server Actions para mutaciones
- Cookie httpOnly para el token JWT (nunca expuesto al JavaScript del navegador)

## Configuración

Copia `.env.example` a `.env.local` y ajusta la URL si tu API corre en otro host/puerto:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

La llave publicable de Stripe (`pk_test_...`) es pública por diseño y debe pertenecer a la
**misma cuenta** cuya `STRIPE_SECRET` usa el backend. La llave secreta (`sk_test_...`) nunca
va en el frontend.

## Ejecutar el proyecto

Requiere la API (Laravel + Docker) corriendo en paralelo, según su propio README.

```bash
npm install
npm install @stripe/stripe-js @stripe/react-stripe-js
npm run dev
```

La app queda disponible en `http://localhost:3000`.

## Rutas implementadas

| Ruta                                   | Descripción                                   | Protegida |
|-----------------------------------------|------------------------------------------------|-----------|
| `/`                                      | Catálogo público (búsqueda por `?search=`)     | No        |
| `/productos/[id]`                        | Detalle de producto                            | No        |
| `/login`                                 | Inicio de sesión                               | No        |
| `/registro`                              | Registro de cuenta nueva                       | No        |
| `/carrito`                               | Carrito de compra (estado local del navegador) | Sí        |
| `/checkout`                              | Crear orden + pagar con Stripe.js (modo test)  | Sí        |
| `/checkout/confirmacion/[orderId]`       | Confirmación de compra                         | Sí        |
| `/historial`                             | Historial de órdenes del usuario               | Sí        |

Las rutas protegidas están cubiertas dos veces, a propósito: `proxy.ts` (equivalente a
`middleware.ts` en Next.js 16) redirige a `/login` antes de renderizar nada, y
`app/(protected)/layout.tsx` vuelve a validar la cookie del lado del servidor como
segunda barrera.

## Decisiones y supuestos a verificar contra tu API real

Estos puntos se armaron con base en el README de la API y en los ejemplos de respuesta
que se confirmaron durante el desarrollo. Si tu API responde distinto, ajusta
`lib/types.ts` y las funciones en `lib/*.ts` / `lib/actions/*.ts`:

- **Login/registro** (`/auth/login`, `/auth/register`): se asume que devuelven
  `{ success: true, data: { access_token, token_type, user } }`.
- **Crear orden** (`POST /orders`): se asume que el cuerpo esperado es
  `{ items: [{ product_id, quantity }] }` y que la respuesta trae `id`, `status`, `total`
  e `items` con `product_name`, `unit_price` y `subtotal`.
- **Pago** (flujo de 3 pasos): `POST /payments/create-intent` (`{ order_id }`) devuelve el
  `stripe_client_secret`; Stripe.js cobra la tarjeta en el navegador; y
  `POST /payments/confirm` (`{ payment_intent_id }`) hace que la API consulte a Stripe y marque
  la orden como pagada. Tarjetas de prueba: `4242 4242 4242 4242` (aprueba) y
  `4000 0000 0000 0002` (rechaza).
- **Historial** (`GET /orders`): se asume la misma forma `{ success, data: [...], meta }`
  que confirmaste para `/products`.

## Rendimiento y resiliencia

- `loading.tsx` en el catálogo y en el historial, con esqueletos que imitan el layout real.
- `error.tsx` en el segmento público y en el protegido, con botón de reintento.
- `Suspense` envolviendo `ProductGrid` (catálogo) y `OrderList` (historial), que son las
  secciones con fetch a la API.
- `revalidateTag("products"/"orders")` y `revalidatePath("/historial")` tras crear una
  orden y tras confirmar un pago exitoso, para que el historial nunca muestre datos desactualizados.
- Evidencia de Lighthouse: agrega aquí las capturas/PDF del reporte (`npm run build && npm start`,
  y correr Lighthouse contra esa build de producción, no contra `next dev`).
