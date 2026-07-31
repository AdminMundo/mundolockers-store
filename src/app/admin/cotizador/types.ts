export type QuoteDocumentItem = {
  quantity: number;
  sku: string;
  name: string;
  variant: string | null;
  unitPrice: number;
};

export type QuoteDocumentData = {
  folioLabel: string;
  clienteNombre: string;
  clienteRut: string;
  clienteDireccion: string;
  clienteTelefono: string;
  fechaEmisionLabel: string;
  vendedor: string;
  formaPago: string;
  referencia: string;
  items: QuoteDocumentItem[];
  subtotal: number;
  descuentoTipo: "pct" | "monto";
  descuentoValor: number;
  descuentoMonto: number;
  neto: number;
  iva: number;
  total: number;
  condiciones: string;
  vigenciaDias: number;
};
