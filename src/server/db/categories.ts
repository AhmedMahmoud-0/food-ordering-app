import { cache } from "@/lib/cache";
import { db } from "@/lib/prisma";

export const getCategories = cache(
  () => {
    const categories = db.category.findMany({
      orderBy: {
        orders: "asc",
      },
    });
    return categories;
  },
  ["categories"],
  { Revalidate: 3600 },
);
