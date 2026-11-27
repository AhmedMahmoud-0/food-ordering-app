"use client";

import { Routes } from "@/constants/enums";
import Link from "../link";
import { ShoppingCartIcon } from "lucide-react";
import { gitCartQuantity } from "@/lib/cart";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCartHydrated,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useParams } from "next/navigation";

function CartButton() {
  const { locale } = useParams<{ locale: string }>();
  const cart = useAppSelector(selectCartItems);
  const isHydrated = useAppSelector(selectCartHydrated);
  const cartQuantity = isHydrated ? gitCartQuantity(cart) : 0;

  return (
    <Link
      href={`/${locale}/${Routes.CART}`}
      className="cart-button"
      aria-label="Shopping cart"
    >
      {isHydrated && <span className="cart-count">{cartQuantity}</span>}
      <ShoppingCartIcon className="size-5" aria-hidden="true" />
    </Link>
  );
}

export default CartButton;
