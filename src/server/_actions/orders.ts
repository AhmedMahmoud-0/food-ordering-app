"use server";

import { db } from "@/lib/prisma";
import { authOptions } from "@/server/auth";
import { orderSchema } from "@/validations/order";
import { getServerSession } from "next-auth";
import { updateTag } from "next/cache";

type CreateOrderData = {
  phone: string;
  address: string;
  building: string;
  city: string;
  notes: string;
  cart: {
    productId: string;
    quantity?: number;
    size?: {
      id: string;
    };
    extras?: {
      id: string;
    }[];
  }[];
};

export const createOrder = async (data: CreateOrderData) => {
  try {
    if (!data.cart.length) {
      return {
        status: 400,
        message: "Cart is empty",
      };
    }
    const validation = orderSchema.safeParse({
      phone: data.phone,
      address: data.address,
      building: data.building,
      city: data.city,
      notes: data.notes,
    });

    if (!validation.success) {
      return {
        status: 400,
        message: "Invalid order data",
      };
    }

    const session = await getServerSession(authOptions);

    const productIds = data.cart.map((item) => item.productId);

    const products = await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      include: {
        sizes: true,
        extras: true,
      },
    });

    if (products.length !== new Set(productIds).size) {
      return {
        status: 400,
        message: "One or more products were not found",
      };
    }

    let subTotal = 0;

    const orderProducts = data.cart.map((cartItem) => {
      const product = products.find(
        (product) => product.id === cartItem.productId,
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const quantity = cartItem.quantity || 1;

      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Invalid quantity");
      }

      const size = cartItem.size
        ? product.sizes.find((size) => size.id === cartItem.size?.id)
        : undefined;

      if (cartItem.size && !size) {
        throw new Error("Invalid product size");
      }

      const extras = (cartItem.extras || []).map((extra) => {
        const productExtra = product.extras.find(
          (productExtra) => productExtra.id === extra.id,
        );

        if (!productExtra) {
          throw new Error("Invalid product extra");
        }

        return productExtra;
      });

      const unitPrice =
        product.basePrice +
        (size?.price || 0) +
        extras.reduce((total, extra) => total + extra.price, 0);

      subTotal += unitPrice * quantity;

      return {
        quantity,
        unitPrice,

        ...(size && {
          size: {
            id: size.id,
            name: size.name,
            price: size.price,
          },
        }),

        extras: extras.map((extra) => ({
          id: extra.id,
          name: extra.name,
          price: extra.price,
        })),

        product: {
          connect: {
            id: product.id,
          },
        },
      };
    });

    const deliveryFee = 5;
    const totalPrice = subTotal + deliveryFee;

    const order = await db.order.create({
      data: {
        phone: data.phone,
        streetAddress: data.address,
        building: data.building,
        city: data.city,
        deliveryNotes: data.notes || null,
        paymentStatus: "PENDING",
        orderStatus: "PENDING",

        userEmail: session?.user?.email ?? null,

        ...(session?.user?.id && {
          user: {
            connect: {
              id: session.user.id,
            },
          },
        }),

        subTotal,
        deliveryFee,
        totalPrice,

        products: {
          create: orderProducts,
        },
      },

      include: {
        products: true,
      },
    });
    updateTag("best-sellers");

    return {
      status: 201,
      message: "Order created successfully",
      order,
    };
  } catch (error) {
    console.error("Create order error:", error);

    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return { status: 403, code: "UNAUTHORIZED" };
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { status: 404, code: "ORDER_NOT_FOUND" };
    }

    const currentStatus = order.orderStatus as OrderStatus;

    if (!allowedTransitions[currentStatus].includes(status)) {
      return { status: 400, code: "INVALID_STATUS_TRANSITION" };
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
    });

    return { status: 200, order: updatedOrder };
  } catch (error) {
    console.error("Update order status error:", error);

    return { status: 500, code: "UPDATE_ORDER_STATUS_FAILED" };
  }
};
