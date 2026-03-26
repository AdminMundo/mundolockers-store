export type CartFlow = "purchase" | "quote";

export type CurrencyCode = "CLP";

export type CartLineVariant = {
  id: string;
  name: string;
};

export type CartLineProduct = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl: string | null;
};

export type CartLinePricing = {
  currency: CurrencyCode;
  unitPrice: number | null;
  compareAtPrice: number | null;
};

export type CartLineCapabilities = {
  canPurchase: boolean;
  canQuote: boolean;
};

export type CartLineMetadata = {
  leadTimeLabel: string | null;
};

export type CartLine = {
  id: string;
  flow: CartFlow;
  quantity: number;
  product: CartLineProduct;
  variant: CartLineVariant | null;
  pricing: CartLinePricing;
  capabilities: CartLineCapabilities;
  metadata: CartLineMetadata;
};

export type CartState = {
  version: 1;
  updatedAt: string;
  items: CartLine[];
};

export type AddCartLineInput = {
  productId: string;
  slug: string;
  sku: string;
  name: string;
  imageUrl?: string | null;
  variant?: CartLineVariant | null;
  unitPrice?: number | null;
  compareAtPrice?: number | null;
  quantity?: number;
  flow?: CartFlow;
  canPurchase: boolean;
  canQuote: boolean;
  leadTimeLabel?: string | null;
};

export type CartSummary = {
  lineCount: number;
  totalQuantity: number;
  purchaseLineCount: number;
  purchaseQuantity: number;
  purchaseSubtotal: number;
  quoteLineCount: number;
  quoteQuantity: number;
  checkoutEnabled: boolean;
  quoteEnabled: boolean;
  mixedFlow: boolean;
};
export type CartItem = {
  lineId: string; // slug + variantId (o solo slug)
  productId: string | null;
  slug: string;
  name: string;
  variantId: string | null;
  variantName: string | null;

  imageUrl: string | null;
  priceCLP: number | null; // null => "Consultar"

  qty: number;
};


export type CartActions = {
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
};