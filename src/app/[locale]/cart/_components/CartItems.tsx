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
import { ReceiptText, ShoppingBasket, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

function CartItems({ translations }: { translations: Translations }) {
  const cart = useAppSelector(selectCartItems);
  const isHydrated = useAppSelector(selectCartHydrated);
  const dispatch = useAppDispatch();
  const subTotal = getSubTotal(cart);
  const total = subTotal + deliveryFee;

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  if (!isHydrated) {
    return (
      <div className="surface-card flex min-h-72 items-center justify-center p-8">
        <Loader className="size-8" />
      </div>
    );
  }

  if (!cart.length) {
    return (
      <section className="surface-card flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
        <span className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
          <ShoppingBasket className="size-7" aria-hidden="true" />
        </span>
        <p className="max-w-sm text-sm font-medium leading-7 text-muted-foreground">
          {translations.cart.emptyCart}
        </p>
      </section>
    );
  }

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border/80 bg-secondary/35 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <ShoppingBasket className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-base font-extrabold text-foreground sm:text-lg">
              {translations.cart.title}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">
              {cart.length}
            </p>
          </div>
        </div>
        <span className="rounded-full border border-border bg-white px-3 py-1 text-xs font-bold text-muted-foreground">
          {formatCurrency(subTotal)}
        </span>
      </div>

      <div className="px-4 sm:px-7">
        <ul className="divide-y divide-border/80">
          {cart.map((item) => {
            const unitPrice =
              item.basePrice +
              (item.size?.price ?? 0) +
              (item.extras ?? []).reduce(
                (sum, extra) => sum + extra.price,
                0,
              );
            const itemTotal = unitPrice * item.quantity!;

            return (
              <li key={item.id} className="py-5 first:pt-5 last:pb-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-secondary/65 p-2 sm:size-28">
                      <Image
                        src={item.image}
                        className="object-contain"
                        alt={item.name}
                        fill
                        sizes="112px"
                      />
                    </div>

                    <div className="min-w-0 flex-1 pt-1">
                      <h3 className="break-words text-base font-extrabold leading-snug text-foreground sm:text-lg">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {item.size && (
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                            {translations.cart.size}: {item.size.name}
                          </span>
                        )}
                        <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                          × {item.quantity}
                        </span>
                      </div>

                      {item.extras && item.extras.length > 0 && (
                        <div className="mt-3">
                          <p className="mb-1 text-xs font-bold text-muted-foreground">
                            {translations.cart.extras}
                          </p>
                          <ul className="flex flex-wrap gap-1.5">
                            {item.extras.map((extra) => (
                              <li
                                key={extra.id}
                                className="rounded-lg border border-border/70 bg-white px-2.5 py-1 text-xs text-muted-foreground"
                              >
                                {extra.name} · {formatCurrency(extra.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-t border-dashed border-border/80 pt-3 sm:min-w-32 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                    <strong className="text-base font-extrabold tabular-nums text-foreground sm:text-lg">
                      {formatCurrency(itemTotal)}
                    </strong>
                    <Button
                      type="button"
                      onClick={() =>
                        dispatch(removeItemFromCart({ id: item.id }))
                      }
                      variant="outline"
                      size="icon"
                      title={item.name}
                      className="size-10 rounded-xl border-border bg-white text-muted-foreground hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-border/80 bg-secondary/25 px-5 py-5 sm:px-7 sm:py-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-foreground">
          <ReceiptText className="size-4 text-primary" aria-hidden="true" />
          {translations.cart.total}
        </div>
        <dl className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-4 text-muted-foreground">
            <dt>{translations.cart.subtotal}</dt>
            <dd className="font-semibold tabular-nums text-foreground">
              {formatCurrency(subTotal)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 text-muted-foreground">
            <dt>{translations.cart.delivery}</dt>
            <dd className="font-semibold tabular-nums text-foreground">
              {formatCurrency(deliveryFee)}
            </dd>
          </div>
          <div className="mt-1 flex items-center justify-between gap-4 border-t border-border/80 pt-4">
            <dt className="font-extrabold text-foreground">
              {translations.cart.total}
            </dt>
            <dd className="text-xl font-black tabular-nums text-primary">
              {formatCurrency(total)}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export default CartItems;
