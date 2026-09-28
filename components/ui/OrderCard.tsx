import Link from "next/link";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const STATUS_LABEL: Record<string, string> = {
  pending: "En progreso",
  paid: "Nivel superado",
  cancelled: "Game Over",
};

export default function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/checkout/confirmacion/${order.id}`}
      className="pixel-panel flex items-center justify-between rounded-xl px-5 py-4 transition-transform hover:-translate-y-0.5"
    >
      <div>
        <p className="font-mono text-xs text-ink-soft">#{order.id}</p>
        <p className="text-sm text-ink-soft">
          {new Date(order.created_at).toLocaleDateString("es-SV")}
        </p>
      </div>
      <div className="text-right">
        <p className="font-display text-xs text-coin-dark">🪙 {formatPrice(order.total)}</p>
        <p className="text-xs text-ink-soft">{STATUS_LABEL[order.status] ?? order.status}</p>
      </div>
    </Link>
  );
}
