import { db } from "@/lib/prisma";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";

export const getUserOrders = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return [];
  }

  return db.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getAdminOrders = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return [];
  }

  return db.order.findMany({
    include: {
      user: true,
      products: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
export const getAdminOrderById = async (orderId: string) => {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    return null;
  }

  return db.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      user: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};
export const getUserOrderById = async (orderId: string) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return db.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });
};
