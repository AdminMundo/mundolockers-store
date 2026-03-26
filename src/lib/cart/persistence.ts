import {
  CART_COOKIE_MAX_AGE_SECONDS,
  CART_COOKIE_NAME,
  CART_SCHEMA_VERSION,
  CART_STORAGE_KEY,
} from "@/lib/cart/constants";
import { createEmptyCartState, normalizeQuantity } from "@/lib/cart/model";
import type {
  CartFlow,
  CartLine,
  CartLineCapabilities,
  CartLineMetadata,
  CartLinePricing,
  CartLineProduct,
  CartLineVariant,
  CartState,
} from "@/lib/cart/types";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isFlow(value: unknown): value is CartFlow {
  return value === "purchase" || value === "quote";
}

function maybeDecode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function parseVariant(value: unknown): CartLineVariant | null {
  if (value === null) {
    return null;
  }

  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const name = value.name;

  if (!isString(id) || !isString(name)) {
    return null;
  }

  return { id, name };
}

function parseProduct(value: unknown): CartLineProduct | null {
  if (!isRecord(value)) {
    return null;
  }

  const productId = value.productId;
  const slug = value.slug;
  const sku = value.sku;
  const name = value.name;
  const imageUrl = value.imageUrl;

  if (!isString(productId) || !isString(slug) || !isString(sku) || !isString(name)) {
    return null;
  }

  if (!(imageUrl === null || isString(imageUrl))) {
    return null;
  }

  return {
    productId,
    slug,
    sku,
    name,
    imageUrl,
  };
}

function parsePricing(value: unknown): CartLinePricing | null {
  if (!isRecord(value)) {
    return null;
  }

  const currency = value.currency;
  const unitPrice = value.unitPrice;
  const compareAtPrice = value.compareAtPrice;

  if (currency !== "CLP") {
    return null;
  }

  if (!(unitPrice === null || isNumber(unitPrice))) {
    return null;
  }

  if (!(compareAtPrice === null || isNumber(compareAtPrice))) {
    return null;
  }

  return {
    currency: "CLP",
    unitPrice,
    compareAtPrice,
  };
}

function parseCapabilities(value: unknown): CartLineCapabilities | null {
  if (!isRecord(value)) {
    return null;
  }

  const canPurchase = value.canPurchase;
  const canQuote = value.canQuote;

  if (!isBoolean(canPurchase) || !isBoolean(canQuote)) {
    return null;
  }

  return {
    canPurchase,
    canQuote,
  };
}

function parseMetadata(value: unknown): CartLineMetadata | null {
  if (!isRecord(value)) {
    return null;
  }

  const leadTimeLabel = value.leadTimeLabel;

  if (!(leadTimeLabel === null || isString(leadTimeLabel))) {
    return null;
  }

  return {
    leadTimeLabel,
  };
}

function parseCartLine(value: unknown): CartLine | null {
  if (!isRecord(value)) {
    return null;
  }

  const id = value.id;
  const flow = value.flow;
  const quantity = value.quantity;
  const product = value.product;
  const variant = value.variant;
  const pricing = value.pricing;
  const capabilities = value.capabilities;
  const metadata = value.metadata;

  if (!isString(id) || !isFlow(flow) || !isNumber(quantity)) {
    return null;
  }

  const parsedProduct = parseProduct(product);
  const parsedVariant = parseVariant(variant);
  const parsedPricing = parsePricing(pricing);
  const parsedCapabilities = parseCapabilities(capabilities);
  const parsedMetadata = parseMetadata(metadata);

  if (
    parsedProduct === null ||
    parsedPricing === null ||
    parsedCapabilities === null ||
    parsedMetadata === null
  ) {
    return null;
  }

  return {
    id,
    flow,
    quantity: normalizeQuantity(quantity),
    product: parsedProduct,
    variant: parsedVariant,
    pricing: parsedPricing,
    capabilities: parsedCapabilities,
    metadata: parsedMetadata,
  };
}

export function serializeCartState(state: CartState): string {
  return JSON.stringify(state);
}

export function deserializeCartState(raw: string | null | undefined): CartState {
  if (!raw) {
    return createEmptyCartState();
  }

  try {
    const parsed = JSON.parse(maybeDecode(raw)) as unknown;

    if (!isRecord(parsed)) {
      return createEmptyCartState();
    }

    const version = parsed.version;
    const updatedAt = parsed.updatedAt;
    const items = parsed.items;

    if (version !== CART_SCHEMA_VERSION) {
      return createEmptyCartState();
    }

    if (!isString(updatedAt) || !Array.isArray(items)) {
      return createEmptyCartState();
    }

    const safeItems: CartLine[] = items
      .map((item) => parseCartLine(item))
      .filter((item): item is CartLine => item !== null);

    return {
      version: CART_SCHEMA_VERSION,
      updatedAt,
      items: safeItems,
    };
  } catch {
    return createEmptyCartState();
  }
}

export function readCartFromLocalStorage(): CartState {
  if (!isBrowser()) {
    return createEmptyCartState();
  }

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  return deserializeCartState(raw);
}

export function writeCartToLocalStorage(state: CartState): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, serializeCartState(state));
}

export function removeCartFromLocalStorage(): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function writeCartToBrowserCookie(state: CartState): void {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const value = encodeURIComponent(serializeCartState(state));

  document.cookie =
    `${CART_COOKIE_NAME}=${value}; Path=/; Max-Age=${CART_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function clearCartBrowserCookie(): void {
  if (!isBrowser()) {
    return;
  }

  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${CART_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}