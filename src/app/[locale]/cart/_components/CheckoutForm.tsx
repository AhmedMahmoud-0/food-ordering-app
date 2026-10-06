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

  return (
    cart &&
    cart.length > 0 && (
      <div className="grid gap-6 rounded-md bg-gray-100 p-4">
        <h2 className="text-2xl font-semibold text-black">{checkout.title}</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="phone" className="text-accent">
                {checkout.phone}
              </Label>

              <Input
                id="phone"
                placeholder={checkout.phone}
                type="text"
                name="phone"
                aria-invalid={!!errors.phone}
              />

              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div className="grid gap-1">
              <Label htmlFor="address" className="text-accent">
                {checkout.address}
              </Label>

              <Textarea
                id="address"
                placeholder={checkout.address}
                name="address"
                className="resize-none"
                aria-invalid={!!errors.address}
              />

              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Label htmlFor="building" className="text-accent">
                  {checkout.building}
                </Label>

                <Input
                  type="text"
                  id="building"
                  placeholder={checkout.building}
                  name="building"
                  aria-invalid={!!errors.building}
                />

                {errors.building && (
                  <p className="text-sm text-red-500">{errors.building}</p>
                )}
              </div>

              <div className="grid gap-1">
                <Label htmlFor="city" className="text-accent">
                  {checkout.city}
                </Label>

                <Input
                  type="text"
                  id="city"
                  placeholder={checkout.city}
                  name="city"
                  aria-invalid={!!errors.city}
                />

                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="notes" className="text-accent">
                {checkout.notes}
              </Label>

              <Textarea
                id="notes"
                placeholder={checkout.notes}
                name="notes"
                className="resize-none"
              />
            </div>

            {errors.form && (
              <p className="text-sm text-red-500">{errors.form}</p>
            )}

            <Button type="submit" className="h-10" disabled={isLoading}>
              {isLoading
                ? checkout.processing
                : `${checkout.submit} ${formatCurrency(totalAmount)}`}
            </Button>
          </div>
        </form>
      </div>
    )
  );
}

export default CheckoutForm;
