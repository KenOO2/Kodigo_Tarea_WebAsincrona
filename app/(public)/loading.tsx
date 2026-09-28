import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <p className="font-display text-xs text-ink-soft">Cargando… ⭐</p>
      <ProductGridSkeleton />
    </div>
  );
}
