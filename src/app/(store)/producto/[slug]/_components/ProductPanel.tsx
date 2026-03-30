import type { ProductDetail } from "@/lib/product";
import PriceLine from "./PriceLine";
import SpecsBox from "./SpecsBox";
import ProductPurchaseBox from "./ProductPurchaseBox";

export default function ProductPanel({ product }: { product: ProductDetail }) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {product.name}
        </h1>

        {product.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-zinc-600">
            {product.description}
          </p>
        ) : (
          <p className="text-sm text-zinc-500">Descripción próximamente.</p>
        )}
      </header>

      <PriceLine priceFrom={product.price_from_clp} />

      <ProductPurchaseBox product={product} />

      <SpecsBox specs={product.specs} />
    </section>
  );
}