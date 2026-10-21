export default function PriceLine({
  priceFrom,
  salePriceClp,
}: {
  priceFrom: number;
  salePriceClp?: number | null;
}) {
  const onSale =
    typeof salePriceClp === "number" && salePriceClp > 0 && priceFrom > 0 && salePriceClp < priceFrom;

  return (
    <div className="space-y-1">
      <div className="text-sm text-zinc-500">Desde</div>
      {onSale ? (
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-zinc-400 line-through">{formatCLP(priceFrom)}</span>
          <span className="text-xl font-semibold text-[#0477BF]">{formatCLP(salePriceClp!)}</span>
        </div>
      ) : (
        <div className="text-xl font-semibold text-zinc-900">
          {priceFrom > 0 ? formatCLP(priceFrom) : "Consultar"}
        </div>
      )}
    </div>
  );
}

function formatCLP(v: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(v);
}
