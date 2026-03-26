"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";

import { CheckoutEmptyState } from "@/components/checkout/checkout-empty-state";
import { formatClp } from "@/lib/cart/format";
import { useCart } from "@/lib/cart/use-cart";
import type { CartLine, CartState } from "@/lib/cart/types";
import { CartHero } from "@/components/cart/cart-hero";

type Props = {
  initialState: CartState;
};

type DocumentType = "boleta" | "factura";
type ShippingMode = "despacho" | "retiro";
type PaymentMethod = "webpay" | "transferencia";

type CheckoutFormState = {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  documentType: DocumentType;
  taxId: string;
  shippingMode: ShippingMode;
  region: string;
  commune: string;
  addressLine1: string;
  addressLine2: string;
  orderNotes: string;
  paymentMethod: PaymentMethod;
};

type CheckoutFormErrors = Partial<Record<keyof CheckoutFormState, string>>;

const INITIAL_FORM_STATE: CheckoutFormState = {
  fullName: "",
  companyName: "",
  email: "",
  phone: "",
  documentType: "boleta",
  taxId: "",
  shippingMode: "despacho",
  region: "",
  commune: "",
  addressLine1: "",
  addressLine2: "",
  orderNotes: "",
  paymentMethod: "webpay",
};

function getPurchaseLineSubtotal(item: CartLine): number {
  const unitPrice = item.pricing.unitPrice ?? 0;
  return unitPrice * item.quantity;
}

function validateCheckoutForm(form: CheckoutFormState): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Ingresa el nombre del contacto.";
  }

  if (!form.email.trim()) {
    errors.email = "Ingresa un correo electrónico.";
  } else if (!form.email.includes("@")) {
    errors.email = "Ingresa un correo válido.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Ingresa un teléfono.";
  }

  if (form.documentType === "factura" && !form.taxId.trim()) {
    errors.taxId = "Ingresa el RUT para factura.";
  }

  if (form.shippingMode === "despacho") {
    if (!form.region.trim()) {
      errors.region = "Selecciona o escribe la región.";
    }

    if (!form.commune.trim()) {
      errors.commune = "Ingresa la comuna.";
    }

    if (!form.addressLine1.trim()) {
      errors.addressLine1 = "Ingresa la dirección.";
    }
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-xs text-red-600">{message}</p>;
}

function TextInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel";
  error?: string;
}) {
  const { label, value, onChange, placeholder, type = "text", error } = props;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
      <FieldError message={error} />
    </label>
  );
}

function TextArea(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const { label, value, onChange, placeholder } = props;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-neutral-800">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
      />
    </label>
  );
}

function RadioCard<T extends string>(props: {
  name: string;
  value: T;
  checked: boolean;
  title: string;
  description: string;
  onChange: (value: T) => void;
}) {
  const { name, value, checked, title, description, onChange } = props;

  return (
    <label
      className={`block rounded-2xl border p-4 transition ${
        checked
          ? "border-neutral-950 bg-neutral-50"
          : "border-black/10 bg-white hover:bg-neutral-50"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <div className="text-sm font-medium text-neutral-950">{title}</div>
      <p className="mt-1 text-sm leading-6 text-neutral-600">{description}</p>
    </label>
  );
}

function CheckoutLineItem({ item }: { item: CartLine }) {
  const subtotal = getPurchaseLineSubtotal(item);

  return (
    <article className="flex gap-4 rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
            Sin imagen
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-tight text-neutral-950 sm:text-base">
          {item.product.name}
        </h3>

        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600 sm:text-sm">
          <span>SKU: {item.product.sku}</span>
          {item.variant ? <span>Variante: {item.variant.name}</span> : null}
          <span>Cantidad: {item.quantity}</span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-neutral-600">
            Unitario: {formatClp(item.pricing.unitPrice ?? 0)}
          </span>
          <span className="font-semibold text-neutral-950">
            {formatClp(subtotal)}
          </span>
        </div>
      </div>
    </article>
  );
}

export function CheckoutPageClient({ initialState }: Props) {
  const { purchaseItems, quoteItems, summary } = useCart(initialState);

  const [form, setForm] = useState<CheckoutFormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const subtotal = summary.purchaseSubtotal;
  const shippingLabel = "Se confirma según comuna y volumen";
  const totalLabel = formatClp(subtotal);

  const purchaseCountLabel = useMemo(() => {
    return `${summary.purchaseQuantity} producto(s)`;
  }, [summary.purchaseQuantity]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateCheckoutForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitMessage("");
      return;
    }

    setSubmitMessage(
      "Formulario validado. El siguiente paso es conectar este checkout con Webpay/transferencia y crear la orden real.",
    );
  };

  if (purchaseItems.length === 0) {
    return (
      <main className="relative z-0 bg-neutral-50">
        <CartHero
          title="Checkout"
          description="Completa tus datos para continuar con la compra directa de productos estándar."
        />

        <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <CheckoutEmptyState />
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-0 bg-neutral-50">
      <CartHero
        title="Checkout"
        description="Completa tus datos para continuar con la compra directa de productos estándar."
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-10 lg:pt-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {quoteItems.length > 0 ? (
              <section className="rounded-[28px] border border-amber-200 bg-amber-50 p-5 sm:p-6">
                <h2 className="text-lg font-semibold tracking-tight text-amber-900">
                  Tienes productos para cotizar
                </h2>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  Este checkout solo procesará productos de compra directa. Tus{" "}
                  {summary.quoteQuantity} producto(s) de cotización continúan
                  por un flujo separado.
                </p>

                <div className="mt-4">
                  <Link
                    href="/cotizar"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-amber-300 bg-white px-5 py-3 text-sm font-medium text-amber-900 transition hover:bg-amber-100"
                  >
                    Ir a cotización
                  </Link>
                </div>
              </section>
            ) : null}

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Contacto
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Nombre y apellido"
                  value={form.fullName}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, fullName: value }))
                  }
                  placeholder="Nombre del contacto"
                  error={errors.fullName}
                />

                <TextInput
                  label="Empresa"
                  value={form.companyName}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, companyName: value }))
                  }
                  placeholder="Opcional"
                />

                <TextInput
                  label="Correo electrónico"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, email: value }))
                  }
                  placeholder="correo@empresa.cl"
                  error={errors.email}
                />

                <TextInput
                  label="Teléfono"
                  type="tel"
                  value={form.phone}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, phone: value }))
                  }
                  placeholder="+56 9..."
                  error={errors.phone}
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Documento tributario
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RadioCard<DocumentType>
                  name="documentType"
                  value="boleta"
                  checked={form.documentType === "boleta"}
                  title="Boleta"
                  description="Compra simple para cliente final."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, documentType: value }))
                  }
                />

                <RadioCard<DocumentType>
                  name="documentType"
                  value="factura"
                  checked={form.documentType === "factura"}
                  title="Factura"
                  description="Para empresa con datos tributarios."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, documentType: value }))
                  }
                />
              </div>

              {form.documentType === "factura" ? (
                <div className="mt-4 max-w-sm">
                  <TextInput
                    label="RUT empresa"
                    value={form.taxId}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, taxId: value }))
                    }
                    placeholder="76.123.456-7"
                    error={errors.taxId}
                  />
                </div>
              ) : null}
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Entrega
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RadioCard<ShippingMode>
                  name="shippingMode"
                  value="despacho"
                  checked={form.shippingMode === "despacho"}
                  title="Despacho"
                  description="Coordinamos dirección y costo final."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, shippingMode: value }))
                  }
                />

                <RadioCard<ShippingMode>
                  name="shippingMode"
                  value="retiro"
                  checked={form.shippingMode === "retiro"}
                  title="Retiro"
                  description="Retiro coordinado con el equipo comercial."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, shippingMode: value }))
                  }
                />
              </div>

              {form.shippingMode === "despacho" ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <TextInput
                    label="Región"
                    value={form.region}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, region: value }))
                    }
                    placeholder="Región Metropolitana"
                    error={errors.region}
                  />

                  <TextInput
                    label="Comuna"
                    value={form.commune}
                    onChange={(value) =>
                      setForm((current) => ({ ...current, commune: value }))
                    }
                    placeholder="Santiago"
                    error={errors.commune}
                  />

                  <div className="sm:col-span-2">
                    <TextInput
                      label="Dirección"
                      value={form.addressLine1}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          addressLine1: value,
                        }))
                      }
                      placeholder="Calle, número, oficina o referencia"
                      error={errors.addressLine1}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <TextInput
                      label="Complemento"
                      value={form.addressLine2}
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          addressLine2: value,
                        }))
                      }
                      placeholder="Opcional"
                    />
                  </div>
                </div>
              ) : null}
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Pago
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <RadioCard<PaymentMethod>
                  name="paymentMethod"
                  value="webpay"
                  checked={form.paymentMethod === "webpay"}
                  title="Webpay"
                  description="Pago online con tarjeta o débito."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, paymentMethod: value }))
                  }
                />

                <RadioCard<PaymentMethod>
                  name="paymentMethod"
                  value="transferencia"
                  checked={form.paymentMethod === "transferencia"}
                  title="Transferencia"
                  description="Pago coordinado con instrucciones bancarias."
                  onChange={(value) =>
                    setForm((current) => ({ ...current, paymentMethod: value }))
                  }
                />
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Observaciones
              </h2>

              <div className="mt-5">
                <TextArea
                  label="Notas del pedido"
                  value={form.orderNotes}
                  onChange={(value) =>
                    setForm((current) => ({ ...current, orderNotes: value }))
                  }
                  placeholder="Ejemplo: horario de recepción, referencia de acceso, observaciones del despacho, etc."
                />
              </div>
            </section>

            <div className="hidden lg:block">
              <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Validar datos y continuar
                </button>

                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  Este paso deja listo el checkout. El siguiente bloque será la
                  conexión con la pasarela de pago y la creación real de la
                  orden.
                </p>

                {submitMessage ? (
                  <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                    {submitMessage}
                  </div>
                ) : null}
              </div>
            </div>
          </form>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Tu pedido
              </h2>

              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {purchaseCountLabel}
              </p>

              <div className="mt-5 space-y-4">
                {purchaseItems.map((item) => (
                  <CheckoutLineItem key={item.id} item={item} />
                ))}
              </div>
            </section>

            <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                Resumen de compra
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-medium text-neutral-950">
                    {formatClp(subtotal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-neutral-600">Despacho</span>
                  <span className="text-right font-medium text-neutral-950">
                    {shippingLabel}
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-black/10 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-neutral-700">
                    Total estimado
                  </span>
                  <span className="text-2xl font-semibold tracking-tight text-neutral-950">
                    {totalLabel}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="submit"
                  form="checkout-form"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                  Validar datos y continuar
                </button>

                <Link
                  href="/carrito"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
                >
                  Volver al carrito
                </Link>
              </div>

              {submitMessage ? (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
                  {submitMessage}
                </div>
              ) : null}
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
