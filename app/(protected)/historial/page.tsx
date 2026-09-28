import { Suspense } from "react";
import OrderList from "@/components/ui/OrderList";
import OrderListSkeleton from "@/components/ui/OrderListSkeleton";

export default function HistorialPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-lg text-ink sm:text-2xl">Save Files</h1>
        <p className="mt-2 text-ink-soft">Tu historial de partidas (compras) completadas.</p>
      </div>

      <Suspense fallback={<OrderListSkeleton />}>
        <OrderList />
      </Suspense>
    </div>
  );
}
