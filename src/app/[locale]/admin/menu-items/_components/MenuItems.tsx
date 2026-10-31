import Link from "@/components/link";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { Product } from "@prisma/client";
import Image from "next/image";
import { ArrowUpRight, Utensils } from "lucide-react";

async function MenuItems({ products }: { products: Product[] }) {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return products && products.length > 0 ? (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="group min-w-0">
          <Link
            href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${product.id}/${Pages.EDIT}`}
            className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-border/80 bg-card p-3 shadow-[0_10px_28px_rgba(52,35,22,0.045)] transition-all hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_18px_38px_rgba(52,35,22,0.09)]"
          >
            <div className="relative mb-3 flex h-40 items-center justify-center overflow-hidden rounded-[1.2rem] bg-gradient-to-br from-secondary to-background p-5 sm:h-44">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute end-3 top-3 element-center size-9 rounded-full border border-border/70 bg-card/90 text-muted-foreground shadow-sm transition group-hover:border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight className="size-4" />
              </span>
            </div>
            <div className="flex min-w-0 items-center gap-3 px-2 pb-2">
              <span className="element-center size-9 shrink-0 rounded-xl bg-primary/10 text-primary">
                <Utensils className="size-4" />
              </span>
              <h3 className="min-w-0 flex-1 break-words text-sm font-extrabold leading-6 text-foreground sm:text-base">
                {product.name}
              </h3>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <div className="surface-card grid justify-items-center gap-3 px-5 py-14 text-center">
      <span className="element-center size-14 rounded-2xl bg-secondary text-muted-foreground">
        <Utensils className="size-6" />
      </span>
      <p className="text-sm font-semibold text-muted-foreground">
        {translations.noProductsFound}
      </p>
    </div>
  );
}

export default MenuItems;
