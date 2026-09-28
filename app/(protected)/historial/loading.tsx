import OrderListSkeleton from "@/components/ui/OrderListSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <p className="font-display text-xs text-ink-soft">Cargando partidas… ⭐</p>
      <OrderListSkeleton />
    </div>
  );
}
