import { Suspense } from "react";
import ProductGrid from "@/components/ui/ProductGrid";
import ProductGridSkeleton from "@/components/ui/ProductGridSkeleton";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-lg text-ink sm:text-2xl">World 1-1: Catálogo</h1>
        <p className="mt-2 text-ink-soft">Recolecta los ítems que necesites para tu partida.</p>
      </div>

      <form className="flex gap-2" action="/" method="get">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Buscar ítems…"
          className="w-full max-w-sm rounded-lg border-[3px] border-ink bg-white px-4 py-2 text-sm outline-none"
        />
        <button type="submit" className="pixel-btn rounded-lg bg-coin px-5 py-2 text-sm font-display text-ink hover:bg-coin-dark">
          Buscar
        </button>
      </form>

      {/* key con el término de búsqueda: fuerza a Suspense a mostrar el
          fallback de nuevo cuando cambia la búsqueda, en vez de dejar la
          lista anterior mientras carga la nueva. */}
      <Suspense fallback={<ProductGridSkeleton />} key={search ?? "all"}>
        <ProductGrid search={search} />
      </Suspense>
    </div>
  );
}
