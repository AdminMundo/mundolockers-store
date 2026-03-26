type Props = {
  quantity: number;
  onChange: (nextQuantity: number) => void;
};

export function CartQuantityControl({ quantity, onChange }: Props) {
  return (
    <div className="inline-flex h-11 items-center rounded-2xl border border-black/10 bg-white">
      <button
        type="button"
        aria-label="Disminuir cantidad"
        className="inline-flex h-11 w-11 items-center justify-center text-lg text-neutral-700 transition hover:bg-neutral-50"
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>

      <div className="inline-flex min-w-10 items-center justify-center px-2 text-sm font-medium text-neutral-950">
        {quantity}
      </div>

      <button
        type="button"
        aria-label="Aumentar cantidad"
        className="inline-flex h-11 w-11 items-center justify-center text-lg text-neutral-700 transition hover:bg-neutral-50"
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}