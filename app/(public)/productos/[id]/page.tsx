import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import { ApiError } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import AddToCartForm from "@/components/ui/AddToCartForm";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let res;
  try {
    res = await getProduct(id);
  } catch (err) {
    // 404 real de la API -> página 404 de Next, no un error genérico.
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const product = res.data;

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="pixel-panel flex aspect-square items-center justify-center rounded-xl bg-sky/40">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full rounded-lg object-cover"
          />
        ) : (
          <span className="font-display text-xs text-ink-soft">{product.sku}</span>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs text-ink-soft">{product.sku}</span>
        <h1 className="font-display text-lg text-ink sm:text-2xl">{product.name}</h1>
        <p className="font-display text-base text-coin-dark">🪙 {formatPrice(product.price)}</p>
        <p className="leading-relaxed text-ink-soft">
          {product.description ?? "Sin descripción disponible para este ítem."}
        </p>
        <p className="text-sm text-ink-soft">
          {product.stock > 0 ? `❤️ ${product.stock} vidas disponibles` : "Game Over — sin stock"}
        </p>

        <AddToCartForm product={product} />
      </div>
    </div>
  );
}
