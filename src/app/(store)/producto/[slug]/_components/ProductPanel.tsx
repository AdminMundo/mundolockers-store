import type { ProductDetail } from "@/lib/product";
import PriceLine from "./PriceLine";
import SpecsBox from "./SpecsBox";
import ProductPurchaseBox from "./ProductPurchaseBox";

export default function ProductPanel({
  product,
  hideSpecs = false,
}: {
  product: ProductDetail;
  hideSpecs?: boolean;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {product.name}
        </h2>

        {product.sku ? (
          <p className="text-xs text-zinc-400">SKU: {product.sku}</p>
        ) : null}

        {product.description ? (
          <p className="line-clamp-6 text-sm leading-6 text-zinc-600">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">Descripción próximamente.</p>
        )}
      </header>

      <PriceLine priceFrom={product.price_from_clp} />

      <ProductPurchaseBox product={product} />

      {hideSpecs ? null : <SpecsBox specs={product.specs} />}
    </section>
  );
}