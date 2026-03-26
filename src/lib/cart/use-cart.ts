"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";

import { getCartSummary, splitCartByFlow } from "@/lib/cart/model";
import { cartStore } from "@/lib/cart/store";
import type { CartState } from "@/lib/cart/types";

const EMPTY_SNAPSHOT: CartState = {
  version: 1,
  updatedAt: "1970-01-01T00:00:00.000Z",
  items: [],
};

export function useCart(serverState?: CartState) {
  useEffect(() => {
    cartStore.hydrate(serverState);
  }, [serverState]);

  const state = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getState,
    () => serverState ?? EMPTY_SNAPSHOT,
  );

  const summary = useMemo(() => getCartSummary(state), [state]);
  const split = useMemo(() => splitCartByFlow(state), [state]);

  return {
    state,
    items: state.items,
    summary,
    purchaseItems: split.purchase,
    quoteItems: split.quote,
    isHydrated: cartStore.isHydrated(),
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    setQuantity: cartStore.setQuantity,
    clear: cartStore.clear,
    clearFlow: cartStore.clearFlow,
    replaceState: cartStore.replaceState,
  };
}