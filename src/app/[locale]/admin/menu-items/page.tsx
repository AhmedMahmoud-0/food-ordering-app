import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
import { getProducts } from "@/server/db/products";
import { UserRole } from "@prisma/client";
import { ArrowRightCircle, Plus } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuItems from "./_components/MenuItems";

async function MenuItemsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const locale = (await params).locale;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);
  const products = await getProducts();

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }

  return (
    <main>
      <section className="py-8 md:py-10">
        <div className="container admin-shell">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <span className="section-eyebrow">{translations.admin.tabs.menuItems}</span>
              <h1 className="section-title">{translations.admin.tabs.menuItems}</h1>
            </div>
            <Link
              href={`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${Pages.NEW}`}
              className={`${buttonVariants({ variant: "default" })} h-12 w-full rounded-xl px-5 font-extrabold shadow-[0_8px_18px_rgba(200,59,48,0.16)] sm:w-auto`}
            >
              <Plus className="size-4" />
              {translations.admin["menu-items"].createNewMenuItem}
              <ArrowRightCircle
                className={`size-4 ${locale === Languages.ARABIC ? "rotate-180" : ""}`}
              />
            </Link>
          </div>
          <MenuItems products={products} />
        </div>
      </section>
    </main>
  );
}

export default MenuItemsPage;
