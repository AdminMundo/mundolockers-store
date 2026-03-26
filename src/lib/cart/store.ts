"use client";

"use client";

import { CART_STORAGE_KEY } from "@/lib/cart/constants";
import {
  addLineToCart,
  choosePreferredCartState,
  clearCart,
  clearCartFlow,
  createEmptyCartState,
  getCartSummary,
  removeLineFromCart,
  setLineQuantity,
} from "@/lib/cart/model";
import {
  clearCartBrowserCookie,
  readCartFromLocalStorage,
  removeCartFromLocalStorage,
  writeCartToBrowserCookie,
  writeCartToLocalStorage,
} from "@/lib/cart/persistence";
import type {
  AddCartLineInput,
  CartFlow,
  CartState,
  CartSummary,
} from "@/lib/cart/types";

type Listener = () => void;

class CartStore {
  private state: CartState = createEmptyCartState();
  private listeners = new Set<Listener>();
  private hydrated = false;
  private storageListenerAttached = false;

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  getState = (): CartState => {
    return this.state;
  };

  getSummary = (): CartSummary => {
    return getCartSummary(this.state);
  };

  isHydrated = (): boolean => {
    return this.hydrated;
  };

  hydrate = (serverState?: CartState): void => {
    if (this.hydrated) {
      return;
    }

    const localState = readCartFromLocalStorage();
    const fallbackState = serverState ?? createEmptyCartState();

    this.state = choosePreferredCartState(localState, fallbackState);
    this.hydrated = true;

    this.persist();
    this.emit();
    this.attachStorageListener();
  };

  addItem = (input: AddCartLineInput): void => {
    this.state = addLineToCart(this.state, input);
    this.persist();
    this.emit();
  };

  removeItem = (lineId: string): void => {
    this.state = removeLineFromCart(this.state, lineId);
    this.persist();
    this.emit();
  };

  setQuantity = (lineId: string, quantity: number): void => {
    this.state = setLineQuantity(this.state, lineId, quantity);
    this.persist();
    this.emit();
  };

  clear = (): void => {
    this.state = clearCart();
    this.persist();
    this.emit();
  };

  clearFlow = (flow: CartFlow): void => {
    this.state = clearCartFlow(this.state, flow);
    this.persist();
    this.emit();
  };

  replaceState = (nextState: CartState): void => {
    this.state = nextState;
    this.persist();
    this.emit();
  };

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  private persist(): void {
    if (this.state.items.length === 0) {
      removeCartFromLocalStorage();
      clearCartBrowserCookie();
      return;
    }

    writeCartToLocalStorage(this.state);
    writeCartToBrowserCookie(this.state);
  }

  private attachStorageListener(): void {
    if (this.storageListenerAttached || typeof window === "undefined") {
      return;
    }

    window.addEventListener("storage", this.onStorage);
    this.storageListenerAttached = true;
  }

  private onStorage = (event: StorageEvent): void => {
    if (event.key !== CART_STORAGE_KEY) {
      return;
    }

    this.state = readCartFromLocalStorage();
    this.emit();
  };
}

export const cartStore = new CartStore();