import {
  CART_MAX_LINE_QUANTITY,
  CART_MIN_LINE_QUANTITY,
  CART_SCHEMA_VERSION,
} from "@/lib/cart/constants";
import type {
  AddCartLineInput,
  CartFlow,
  CartLine,
  CartState,
  CartSummary,
} from "@/lib/cart/types";

function nowIso(): string {
  return new Date().toISOString();
}

function touchState(items: CartLine[]): CartState {
  return {
    version: CART_SCHEMA_VERSION,
    updatedAt: nowIso(),
    items,
  };
}

export function createEmptyCartState(): CartState {
  return {
    version: CART_SCHEMA_VERSION,
    updatedAt: nowIso(),
    items: [],
  };
}

export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value)) {
    return CART_MIN_LINE_QUANTITY;
  }

  const rounded = Math.floor(value);

  if (rounded < CART_MIN_LINE_QUANTITY) {
    return CART_MIN_LINE_QUANTITY;
  }

  if (rounded > CART_MAX_LINE_QUANTITY) {
    return CART_MAX_LINE_QUANTITY;
  }

  return rounded;
}

export function buildCartLineId(input: {
  productId: string;
  variantId: string | null;
  flow: CartFlow;
}): string {
  const variantPart = input.variantId ?? "base";
  return `${input.productId}__${variantPart}__${input.flow}`;
}

export function resolveCartFlow(input: AddCartLineInput): CartFlow {
  if (input.flow === "purchase") {
    if (!input.canPurchase) {
      throw new Error("This product cannot be added as a purchase item.");
    }

    return "purchase";
  }

  if (input.flow === "quote") {
    if (!input.canQuote) {
      throw new Error("This product cannot be added as a quote item.");
    }

    return "quote";
  }

  if (input.canPurchase) {
    return "purchase";
  }

  if (input.canQuote) {
    return "quote";
  }

  throw new Error("Cart line must allow purchase or quote.");
}

export function createCartLine(input: AddCartLineInput): CartLine {
  const flow = resolveCartFlow(input);
  const quantity = normalizeQuantity(input.quantity ?? 1);

  if (flow === "purchase" && typeof input.unitPrice !== "number") {
    throw new Error("Purchase items must include a numeric unitPrice.");
  }

  return {
    id: buildCartLineId({
      productId: input.productId,
      variantId: input.variant?.id ?? null,
      flow,
    }),
    flow,
    quantity,
    product: {
      productId: input.productId,
      slug: input.slug,
      sku: input.sku,
      name: input.name,
      imageUrl: input.imageUrl ?? null,
    },
    variant: input.variant ?? null,
    pricing: {
      currency: "CLP",
      unitPrice: flow === "purchase" ? input.unitPrice ?? null : null,
      compareAtPrice: flow === "purchase" ? input.compareAtPrice ?? null : null,
    },
    capabilities: {
      canPurchase: input.canPurchase,
      canQuote: input.canQuote,
    },
    metadata: {
      leadTimeLabel: input.leadTimeLabel ?? null,
    },
  };
}

export function getLineSubtotal(line: CartLine): number {
  if (line.flow !== "purchase") {
    return 0;
  }

  const unitPrice = line.pricing.unitPrice ?? 0;
  return unitPrice * line.quantity;
}

export function addLineToCart(
  state: CartState,
  input: AddCartLineInput,
): CartState {
  const nextLine = createCartLine(input);
  const existing = state.items.find((item) => item.id === nextLine.id);

  if (!existing) {
    return touchState([...state.items, nextLine]);
  }

  const merged: CartLine = {
    ...nextLine,
    quantity: normalizeQuantity(existing.quantity + nextLine.quantity),
  };

  return touchState(
    state.items.map((item) => (item.id === merged.id ? merged : item)),
  );
}

export function setLineQuantity(
  state: CartState,
  lineId: string,
  quantity: number,
): CartState {
  if (quantity <= 0) {
    return removeLineFromCart(state, lineId);
  }

  return touchState(
    state.items.map((item) =>
      item.id === lineId
        ? {
            ...item,
            quantity: normalizeQuantity(quantity),
          }
        : item,
    ),
  );
}

export function removeLineFromCart(
  state: CartState,
  lineId: string,
): CartState {
  return touchState(state.items.filter((item) => item.id !== lineId));
}

export function clearCart(): CartState {
  return touchState([]);
}

export function clearCartFlow(state: CartState, flow: CartFlow): CartState {
  return touchState(state.items.filter((item) => item.flow !== flow));
}

export function splitCartByFlow(state: CartState): {
  purchase: CartLine[];
  quote: CartLine[];
} {
  const purchase: CartLine[] = [];
  const quote: CartLine[] = [];

  for (const item of state.items) {
    if (item.flow === "purchase") {
      purchase.push(item);
    } else {
      quote.push(item);
    }
  }

  return { purchase, quote };
}

export function getCartSummary(state: CartState): CartSummary {
  let totalQuantity = 0;
  let purchaseLineCount = 0;
  let purchaseQuantity = 0;
  let purchaseSubtotal = 0;
  let quoteLineCount = 0;
  let quoteQuantity = 0;

  for (const item of state.items) {
    totalQuantity += item.quantity;

    if (item.flow === "purchase") {
      purchaseLineCount += 1;
      purchaseQuantity += item.quantity;
      purchaseSubtotal += getLineSubtotal(item);
    } else {
      quoteLineCount += 1;
      quoteQuantity += item.quantity;
    }
  }

  return {
    lineCount: state.items.length,
    totalQuantity,
    purchaseLineCount,
    purchaseQuantity,
    purchaseSubtotal,
    quoteLineCount,
    quoteQuantity,
    checkoutEnabled: purchaseLineCount > 0,
    quoteEnabled: quoteLineCount > 0,
    mixedFlow: purchaseLineCount > 0 && quoteLineCount > 0,
  };
}

export function choosePreferredCartState(
  localState: CartState,
  serverState: CartState,
): CartState {
  if (localState.items.length === 0 && serverState.items.length > 0) {
    return serverState;
  }

  if (localState.items.length > 0 && serverState.items.length === 0) {
    return localState;
  }

  const localTime = Date.parse(localState.updatedAt);
  const serverTime = Date.parse(serverState.updatedAt);

  if (Number.isNaN(localTime) || Number.isNaN(serverTime)) {
    return localState;
  }

  return localTime >= serverTime ? localState : serverState;
}