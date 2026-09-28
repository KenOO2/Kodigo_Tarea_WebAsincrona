import Link from "next/link";
import { getOrder } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import ClearCartOnMount from "@/components/ui/ClearCartOnMount";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const res = await getOrder(orderId);
  const order = res.data;

  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <ClearCartOnMount />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-ink bg-coin font-display text-xs">
        1UP
      </div>
      <h1 className="font-display text-lg text-ink sm:text-2xl">¡Compra completada!</h1>
      <p className="text-ink-soft">
        Tu orden <span className="font-mono text-ink">#{order.id}</span> quedó registrada por un
        total de <span className="text-coin-dark">🪙 {formatPrice(order.total)}</span>.
      </p>

      <div className="pixel-panel rounded-xl p-5 text-left">
        <ul className="divide-y-[3px] divide-ink text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>
                {item.product_name} × {item.quantity}
              </span>
              <span>{formatPrice(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center gap-3">
        <Link
          href="/historial"
          className="pixel-btn rounded-lg bg-pipe px-5 py-2.5 font-display text-xs text-white hover:bg-pipe-dark"
        >
          Ver mi historial
        </Link>
        <Link
          href="/"
          className="pixel-btn rounded-lg bg-white px-5 py-2.5 font-display text-xs text-ink hover:bg-sky/40"
        >
          Seguir jugando
        </Link>
      </div>
    </div>
  );
}
