"use client";
import { Routes } from "@/constants/enums";
import Link from "../link";
import { ShoppingCartIcon } from "lucide-react";
import { gitCartQuantity } from "@/lib/cart";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems } from "@/redux/features/cart/cartSlice";

function CartButton() {
  const cart = useAppSelector(selectCartItems);
  const cartQuantity = gitCartQuantity(cart);

  return (
    <Link href={`/${Routes.CART}`} className="block relative group ">
      <span className="absolute -top-4 inset-s-4 w-5 h-5 text-sm bg-primary rounded-full text-white text-center">
        {cartQuantity}
      </span>
      <ShoppingCartIcon
        className={`text-accent group-hover:text-primary duration-200 transition-colors w-6! h-6!`}
      />
    </Link>
  );
}

export default CartButton;
