import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/productos/${product.id}`}
      className="pixel-panel group flex flex-col overflow-hidden rounded-xl transition-transform hover:-translate-y-1"
    >
      <div className="flex aspect-[4/3] items-center justify-center border-b-3 border-ink bg-sky/40 text-ink-soft">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-[10px] tracking-wide">{product.sku}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-mono text-[11px] text-ink-soft">{product.sku}</span>
        <h3 className="text-base font-semibold leading-snug text-ink group-hover:text-sky-deep">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-xs text-coin-dark sm:text-sm">
            🪙 {formatPrice(product.price)}
          </span>
          <span className={outOfStock ? "text-xs text-danger" : "text-xs text-ink-soft"}>
            {outOfStock ? "Game Over" : `❤️ ×${product.stock}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
