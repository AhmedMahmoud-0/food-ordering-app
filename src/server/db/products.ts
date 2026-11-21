import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getProductsByCategory = cache(
  () => {
    const products = db.category.findMany({
      include: {
        products: {
          include: {
            sizes: true,
            extras: true,
          },
        },
      },
    });
    return products;
  },
  ["products-by-category"],
  { Revalidate: 3600 },
);
export const getBestSellers = cache(
  (limit?: number | undefined) => {
    const bestSellers = db.product.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      orderBy: {
        orders: {
          _count: "desc",
        },
      },
      include: {
        sizes: true,
        extras: true,
      },
      take: limit,
    });
    return bestSellers;
  },
  ["best-sellers"],
  { Revalidate: 3600, tags: ["best-sellers"] },
);

export const getNewArrivals = cache(
  (limit = 3) => {
    return db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sizes: true,
        extras: true,
      },
      take: limit,
    });
  },
  ["new-arrivals"],
  { Revalidate: 3600, tags: ["new-arrivals"] },
);

export const getProducts = cache(
  () => {
    const products = db.product.findMany({
      orderBy: {
        order: "asc",
      },
    });
    return products;
  },
  ["products"],
  { Revalidate: 3600 },
);

export const getProduct = cache(
  (id: string) => {
    const product = db.product.findUnique({
      where: {
        id,
      },
      include: {
        sizes: true,
        extras: true,
      },
    });
    return product;
  },
  [`product-${crypto.randomUUID()}`],
  { Revalidate: 3600 },
);
