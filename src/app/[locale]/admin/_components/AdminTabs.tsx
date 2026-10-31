"use client";

import Link from "@/components/link";
import { Pages, Routes } from "@/constants/enums";
import { Translations } from "@/types/translations";
import { useParams, usePathname } from "next/navigation";

function AdminTabs({ translations }: { translations: Translations }) {
  const pathname = usePathname();
  const { locale } = useParams();

  const tabs = [
    {
      title: translations.admin.tabs.profile,
      href: Routes.ADMIN,
    },
    {
      title: translations.admin.tabs.categories,
      href: `${Routes.ADMIN}/${Pages.CATEGORIES}`,
    },
    {
      title: translations.admin.tabs.menuItems,
      href: `${Routes.ADMIN}/${Pages.MENU_ITEMS}`,
    },
    {
      title: translations.admin.tabs.users,
      href: `${Routes.ADMIN}/${Pages.USERS}`,
    },
    {
      title: translations.admin.tabs.orders,
      href: `${Routes.ADMIN}/${Pages.ORDERS}`,
    },
  ];

  const isActiveTab = (href: string) => {
    const basePath = `/${locale}/${href}`;
    return href === Routes.ADMIN
      ? pathname === basePath
      : pathname === basePath || pathname.startsWith(`${basePath}/`);
  };

  return (
    <nav className="sticky top-[76px] z-30 border-b border-border/80 bg-background/90 py-2 shadow-[0_8px_24px_rgba(52,35,22,0.035)] backdrop-blur-xl">
      <ul className="container flex w-full flex-wrap items-center justify-center gap-2.5 py-1">
        {tabs.map((tab) => {
          const active = isActiveTab(tab.href);

          return (
            <li key={tab.href} className="shrink-0">
              <Link
                href={`/${locale}/${tab.href}`}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-12 min-w-[116px] items-center justify-center rounded-xl border px-6 text-sm font-extrabold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:min-w-[132px] ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_7px_18px_rgba(200,59,48,0.18)]"
                    : "border-border/80 bg-card text-muted-foreground hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-[0_7px_16px_rgba(200,59,48,0.08)]"
                }`}
              >
                {tab.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default AdminTabs;
