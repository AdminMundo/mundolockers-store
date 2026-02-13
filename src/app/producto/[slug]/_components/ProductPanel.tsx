import type { ProductDetail } from "@/lib/product";
import VariantSelector from "./VariantSelector";
import PriceLine from "./PriceLine";
import CTAGroup from "./CTAGroup";
import SpecsBox from "./SpecsBox";

export default function ProductPanel({ product }: { product: ProductDetail }) {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          {product.name}
        </h1>

        {product.description ? (
          <p className="text-sm leading-6 text-zinc-600 line-clamp-3">{product.description}</p>
        ) : (
          <p className="text-sm text-zinc-500">Descripción próximamente.</p>
        )}
      </header>

      <PriceLine priceFrom={product.price_from_clp} />

      {/* selector estilo referencia (colores + cantidad) */}
      <VariantSelector variants={product.variants} priceFrom={product.price_from_clp} />

      <CTAGroup productName={product.name} />

      <SpecsBox specs={product.specs} />
      
    </section>
  );
}
