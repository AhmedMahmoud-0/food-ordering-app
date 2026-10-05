"use client";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { deliveryFee, getSubTotal } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import {
  removeItemFromCart,
  selectCartHydrated,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Translations } from "@/types/translations";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

function CartItems({ translations }: { translations: Translations }) {
  const cart = useAppSelector(selectCartItems);
  const isHydrated = useAppSelector(selectCartHydrated);
  const dispatch = useAppDispatch();
  const subTotal = getSubTotal(cart);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  return (
    <div>
      {!isHydrated ? (
        <Loader className="w-8 h-8"/>
      ) : cart && cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative w-24 h-24">
                      <Image
                        src={item.image}
                        className="object-contain"
                        alt={item.name}
                        fill
                      />
                    </div>

                    <div>
                      <h4 className="font-semibold md:text-lg">{item.name}</h4>

                      <div className="relative">
                        {item.size && (
                          <span className="text-sm text-accent">
                            {translations.cart.size} :{item.size.name}{" "}
                          </span>
                        )}

                        {item.extras && item.extras.length > 0 && (
                          <div className="flex gap-1">
                            <span>{translations.cart.extras}:</span>
                            <ul>
                              {item.extras.map((extra) => (
                                <li key={extra.id}>
                                  <span className="text-sm text-accent">
                                    {extra.name} {formatCurrency(extra.price)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <span className="absolute right-0 top-0 text-sm text-black">
                          x{item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center gap-4 justify-end">
                    <strong className="text-black">
                      {formatCurrency(
                        item.basePrice +
                          (item.size?.price ?? 0) +
                          (item.extras ?? []).reduce(
                            (total, extra) => total + extra.price,
                            0,
                          ),
                      )}
                    </strong>

                    <Button
                      onClick={() =>
                        dispatch(removeItemFromCart({ id: item.id }))
                      }
                      variant="secondary"
                      className="border"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col justify-end items-end pt-6">
            <span className="text-accent font-medium">
              {translations.cart.subtotal}:
              <strong className="text-black">{formatCurrency(subTotal)}</strong>
            </span>

            <span className="text-accent font-medium">
              {translations.cart.delivery}:
              <strong className="text-black">
                {formatCurrency(deliveryFee)}
              </strong>
            </span>

            <span className="text-accent font-medium">
              {translations.cart.total}:
              <strong className="text-black">
                {formatCurrency(subTotal + deliveryFee)}
              </strong>
            </span>
          </div>
        </>
      ) : (
        <p className="text-accent">{translations.cart.emptyCart}</p>
      )}
    </div>
  );
}

export default CartItems;
