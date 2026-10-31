"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";
import {
  CartItem,
  ClearCart,
  selectCartItems,
} from "@/redux/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createOrder } from "@/server/_actions/orders";
import { toast } from "@/hooks/use-toast";
import { Translations } from "@/types/translations";
import { processMockPayment } from "@/server/_actions/payments";
import { useParams, useRouter } from "next/navigation";
import { Routes } from "@/constants/enums";
import { ClipboardCheck, CreditCard, MapPin } from "lucide-react";

type FormErrors = {
  phone?: string;
  address?: string;
  building?: string;
  city?: string;
  form?: string;
};

type CheckoutData = {
  phone: string;
  address: string;
  building: string;
  city: string;
  notes: string;
  cart: CartItem[];
};

function CheckoutForm({ translations }: { translations: Translations }) {
  const { locale } = useParams();
  const router = useRouter();
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();
  const totalAmount = getTotalAmount(cart);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { checkout } = translations;

  const validateForm = (formData: FormData) => {
    const phone = String(formData.get("phone") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const building = String(formData.get("building") || "").trim();
    const city = String(formData.get("city") || "").trim();

    const newErrors: FormErrors = {};

    if (!phone) {
      newErrors.phone = checkout.validation.phoneRequired;
    } else {
      const phoneDigits = phone.replace(/\D/g, "");

      if (phoneDigits.length < 7 || phoneDigits.length > 15) {
        newErrors.phone = checkout.validation.phoneInvalid;
      }
    }

    if (!address) {
      newErrors.address = checkout.validation.addressRequired;
    } else if (address.length < 5) {
      newErrors.address = checkout.validation.addressInvalid;
    }

    if (!building) {
      newErrors.building = checkout.validation.buildingRequired;
    }

    if (!city) {
      newErrors.city = checkout.validation.cityRequired;
    }

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    if (!cart.length) {
      setErrors({
        form: checkout.messages.cartEmpty,
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const newErrors = validateForm(formData);

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    const checkoutData: CheckoutData = {
      phone: String(formData.get("phone") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      building: String(formData.get("building") || "").trim(),
      city: String(formData.get("city") || "").trim(),
      notes: String(formData.get("notes") || "").trim(),
      cart,
    };

    try {
      const result = await createOrder(checkoutData);

      if (result.status !== 201 || !result.order) {
        toast({
          title: checkout.messages.orderFailed,
          className: "text-destructive",
        });

        setErrors({
          form: checkout.messages.orderFailed,
        });

        return;
      }

      const paymentResult = await processMockPayment(result.order.id);
      if (paymentResult.status !== 200) {
        const paymentMessage =
          paymentResult.code === "ORDER_NOT_FOUND"
            ? checkout.messages.orderNotFound
            : paymentResult.code === "ALREADY_PAID"
              ? checkout.messages.alreadyPaid
              : checkout.messages.paymentFailed;

        toast({
          title: paymentMessage,
          className: "text-destructive",
        });

        setErrors({
          form: paymentMessage,
        });

        return;
      }
      dispatch(ClearCart());

      toast({
        title: checkout.messages.paymentSuccess,
        className: "text-green-400",
      });
      router.replace(`/${locale}/${Routes.ROOT}`);
    } catch (error) {
      console.error(error);

      toast({
        title: checkout.messages.orderFailed,
        className: "text-destructive",
      });

      setErrors({
        form: checkout.messages.orderFailed,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart.length) return null;

  const fieldClassName = "h-12 rounded-xl border-border/80 bg-white px-4 shadow-none";
  const errorClassName = "rounded-lg bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive";

  return (
    <section className="surface-card overflow-hidden lg:sticky lg:top-28">
      <div className="border-b border-border/80 bg-secondary/35 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
            <ClipboardCheck className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
              {checkout.title}
            </h2>
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {checkout.address}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-2 text-sm font-extrabold text-foreground">
          <MapPin className="size-4 text-primary" aria-hidden="true" />
          {checkout.address}
        </div>

        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-sm font-bold text-foreground">
              {checkout.phone}
            </Label>
            <Input
              id="phone"
              placeholder={checkout.phone}
              type="text"
              name="phone"
              aria-invalid={!!errors.phone}
              className={fieldClassName}
            />
            {errors.phone && <p className={errorClassName}>{errors.phone}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="text-sm font-bold text-foreground">
              {checkout.address}
            </Label>
            <Textarea
              id="address"
              placeholder={checkout.address}
              name="address"
              aria-invalid={!!errors.address}
              className="min-h-24 resize-y rounded-xl border-border/80 bg-white px-4 py-3 shadow-none"
            />
            {errors.address && <p className={errorClassName}>{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="building" className="text-sm font-bold text-foreground">
                {checkout.building}
              </Label>
              <Input
                type="text"
                id="building"
                placeholder={checkout.building}
                name="building"
                aria-invalid={!!errors.building}
                className={fieldClassName}
              />
              {errors.building && <p className={errorClassName}>{errors.building}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="city" className="text-sm font-bold text-foreground">
                {checkout.city}
              </Label>
              <Input
                type="text"
                id="city"
                placeholder={checkout.city}
                name="city"
                aria-invalid={!!errors.city}
                className={fieldClassName}
              />
              {errors.city && <p className={errorClassName}>{errors.city}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-sm font-bold text-foreground">
              {checkout.notes}
            </Label>
            <Textarea
              id="notes"
              placeholder={checkout.notes}
              name="notes"
              className="min-h-20 resize-y rounded-xl border-border/80 bg-white px-4 py-3 shadow-none"
            />
          </div>

          {errors.form && <p className={errorClassName}>{errors.form}</p>}

          <div className="mt-1 rounded-2xl border border-border/80 bg-secondary/35 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <CreditCard className="size-4" aria-hidden="true" />
                {translations.cart.total}
              </span>
              <strong className="text-xl font-black tabular-nums text-foreground">
                {formatCurrency(totalAmount)}
              </strong>
            </div>
          </div>

          <Button
            type="submit"
            className="h-13 w-full rounded-xl text-sm font-extrabold shadow-lg shadow-primary/15"
            disabled={isLoading}
          >
            {isLoading
              ? checkout.processing
              : `${checkout.submit} ${formatCurrency(totalAmount)}`}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default CheckoutForm;
