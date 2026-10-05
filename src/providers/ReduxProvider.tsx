"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import {
  CartItem,
  ClearCart,
  selectCartItems,
  setCartHydrated,
  setCartItems,
} from "@/redux/features/cart/cartSlice";
import { getCartItem } from "@/lib/cart";

const getCartStorageKey = (userId: string) => `cart:user:${userId}`;

const mergeCarts = (userCart: CartItem[], guestCart: CartItem[]) => {
  const mergedCart = [...userCart];

  guestCart.forEach((guestItem) => {
    const existingItem = getCartItem(
      guestItem.productId,
      guestItem.size?.id || "",
      (guestItem.extras || []).map((extra) => extra.id),
      mergedCart,
    );

    if (existingItem) {
      existingItem.quantity =
        (existingItem.quantity || 0) + (guestItem.quantity || 1);
    } else {
      mergedCart.push(guestItem);
    }
  });

  return mergedCart;
};

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const activeUserId = useRef<string | null>(null);
  const isCartLoaded = useRef(false);

  useEffect(() => {
    if (status === "loading") return;

    const currentUserId = session?.user?.id || null;
    const currentCart = selectCartItems(store.getState());

    if (activeUserId.current && activeUserId.current !== currentUserId) {
      localStorage.setItem(
        getCartStorageKey(activeUserId.current),
        JSON.stringify(currentCart),
      );
    }

    if (currentUserId) {
      const savedCart = localStorage.getItem(getCartStorageKey(currentUserId));

      let userCart: CartItem[] = [];

      if (savedCart) {
        try {
          userCart = JSON.parse(savedCart);
        } catch {
          userCart = [];
        }
      }

      const isGuestCart = !activeUserId.current && isCartLoaded.current;

      const finalCart = isGuestCart
        ? mergeCarts(userCart, currentCart)
        : userCart;

      activeUserId.current = currentUserId;

      store.dispatch(setCartItems(finalCart));

      localStorage.setItem(
        getCartStorageKey(currentUserId),
        JSON.stringify(finalCart),
      );
    } else {
      activeUserId.current = null;

      store.dispatch(ClearCart());
    }

    isCartLoaded.current = true;
    store.dispatch(setCartHydrated());
  }, [session, status]);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const userId = activeUserId.current;

      if (!userId) return;

      const cart = selectCartItems(store.getState());

      localStorage.setItem(getCartStorageKey(userId), JSON.stringify(cart));
    });

    return unsubscribe;
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
