/** Precio vigente: el de oferta si es válido (positivo y menor al normal), si no, el normal. */
export function getEffectivePrice(
  priceClp: number | null,
  salePriceClp: number | null,
): number | null {
  if (isOnSale(priceClp, salePriceClp)) return salePriceClp;
  return priceClp;
}

export function isOnSale(
  priceClp: number | null,
  salePriceClp: number | null,
): boolean {
  return (
    typeof priceClp === "number" &&
    priceClp > 0 &&
    typeof salePriceClp === "number" &&
    salePriceClp > 0 &&
    salePriceClp < priceClp
  );
}
