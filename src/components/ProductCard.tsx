import { Link } from "react-router-dom";
import type { Product } from "../lib/types";
import AvailabilityBadge from "./AvailabilityBadge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition hover:border-accent/40 hover:shadow-sm"
    >
      <div className="flex h-36 items-center justify-center bg-canvas">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-xs text-off">Sin imagen</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-ink group-hover:text-accent">{product.name}</h3>
          <AvailabilityBadge value={product.availability} />
        </div>
        <p className="text-xs uppercase tracking-wide text-off">{product.category || "Sin categoría"}</p>
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="font-display font-semibold text-ink">S/ {product.price.toFixed(2)}</span>
          <span className="text-off">Stock: {product.stock}</span>
        </div>
      </div>
    </Link>
  );
}
