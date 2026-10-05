"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/server/_actions/orders";
import { Translations } from "@/types/translations";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/loader";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

type OrderStatusSelectProps = {
  orderId: string;
  currentStatus: OrderStatus;
  translations: {
    statuses: Translations["admin"]["orders"]["details"]["statuses"];
    statusUpdateSuccess: string;
    statusUpdateError: string;
  };
};
const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["PENDING", "CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CONFIRMED", "PREPARING", "CANCELLED"],
  PREPARING: ["PREPARING", "OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
  DELIVERED: ["DELIVERED"],
  CANCELLED: ["CANCELLED"],
};
function OrderStatusSelect({
  orderId,
  currentStatus,
  translations,
}: OrderStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (newStatus: OrderStatus) => {
    setStatus(newStatus);
    setIsLoading(true);
    try {
      const result = await updateOrderStatus(orderId, newStatus);

      if (result.status !== 200) {
        setStatus(currentStatus);
        toast({
          title: translations.statusUpdateError,
          className: "text-destructive",
        });
        return;
      }
      toast({
        title: translations.statusUpdateSuccess,
        className: "text-green-400",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(currentStatus);
      toast({
        title: translations.statusUpdateError,
        className: "text-destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statuses = allowedTransitions[currentStatus];
  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        disabled={isLoading}
        className="rounded-md border bg-background px-3 py-2 text-sm"
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {translations.statuses[item]}
          </option>
        ))}
      </select>

      {isLoading && <Loader />}
    </div>
  );
}

export default OrderStatusSelect;
