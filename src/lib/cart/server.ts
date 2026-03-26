import { cookies } from "next/headers";

import { CART_COOKIE_NAME } from "@/lib/cart/constants";
import { deserializeCartState } from "@/lib/cart/persistence";
import type { CartState } from "@/lib/cart/types";

export async function getCartServerState(): Promise<CartState> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CART_COOKIE_NAME)?.value;

  return deserializeCartState(raw);
}