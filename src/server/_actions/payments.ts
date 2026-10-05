"use server";

import { db } from "@/lib/prisma";

export const processMockPayment = async (orderId: string) => {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        status: 404,
        code: "ORDER_NOT_FOUND",
      };
    }

    if (order.paymentStatus === "PAID") {
      return {
        status: 400,
        code: "ALREADY_PAID",
      };
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
      },
    });

    return {
      status: 200,
      code: "PAYMENT_SUCCESS",
      order: updatedOrder,
    };
  } catch (error) {
    console.error("Mock payment error:", error);

    return {
      status: 500,
      code: "PAYMENT_FAILED",
    };
  }
};
