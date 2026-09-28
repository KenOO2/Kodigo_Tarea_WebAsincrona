import { getProducts } from "@/lib/products";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";

export default async function ProductGrid({ search }: { search?: string }) {
  const res = await getProducts({ search });

  if (res.data.length === 0) {
    return (
      <EmptyState
        title="¡Nivel vacío! 🎮"
        description="No encontramos ítems con ese nombre. Prueba otra búsqueda."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {res.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
