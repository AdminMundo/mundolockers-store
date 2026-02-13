export default function PriceLine({ priceFrom }: { priceFrom: number }) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-zinc-500">Desde</div>
      <div className="text-xl font-semibold text-zinc-900">
        {priceFrom > 0 ? formatCLP(priceFrom) : "Consultar"}
      </div>
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
