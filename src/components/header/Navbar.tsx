"use client";

import { Routes } from "@/constants/enums";
import Link from "../link";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, XIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import LanguageSwitcher from "./language-switcher";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import { UserRole } from "@prisma/client";
import { useClientSession } from "@/hooks/useClientSession";
import AuthButtons from "./auth-buttons";

function Navbar({
  translations,
  initialSession,
}: {
  translations: Translations;
  initialSession: Session | null;
}) {
  const session = useClientSession(initialSession);
  const [openMenu, setOpenMenu] = useState(false);
  const { locale } = useParams();
  const pathname = usePathname();

  const links = [
    {
      id: "menu",
      title: translations.navbar.menu,
      href: Routes.MENU,
    },
    {
      id: "about",
      title: translations.navbar.about,
      href: Routes.ABOUT,
    },
    {
      id: "contact",
      title: translations.navbar.contact,
      href: Routes.CONTACT,
    },
  ];

  const isAdmin = session.data?.user.role === UserRole.ADMIN;

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Button
        variant="outline"
        size="icon"
        className="nav-toggle"
        aria-label="Open navigation"
        aria-expanded={openMenu}
        onClick={() => setOpenMenu(true)}
      >
        <Menu className="size-5" />
      </Button>

      {openMenu && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close navigation"
          onClick={() => setOpenMenu(false)}
        />
      )}

      <ul
        className="mobile-nav-panel"
        data-open={openMenu ? "true" : "false"}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mobile-nav-close"
          aria-label="Close navigation"
          onClick={() => setOpenMenu(false)}
        >
          <XIcon className="size-5" />
        </Button>

        {links.map((link) => (
          <li key={link.id}>
            <Link
              onClick={() => setOpenMenu(false)}
              href={`/${locale}/${link.href}`}
              className={`nav-link ${
                pathname.startsWith(`/${locale}/${link.href}`)
                  ? "nav-link-active"
                  : ""
              }`}
            >
              {link.title}
            </Link>
          </li>
        ))}

        {session.data?.user && (
          <>
            <li>
              <Link
                href={
                  isAdmin
                    ? `/${locale}/${Routes.ADMIN}`
                    : `/${locale}/${Routes.PROFILE}`
                }
                onClick={() => setOpenMenu(false)}
                className={`nav-link ${
                  pathname.startsWith(
                    isAdmin
                      ? `/${locale}/${Routes.ADMIN}`
                      : `/${locale}/${Routes.PROFILE}`,
                  )
                    ? "nav-link-active"
                    : ""
                }`}
              >
                {isAdmin
                  ? translations.navbar.admin
                  : translations.navbar.profile}
              </Link>
            </li>

            {!isAdmin && (
              <li>
                <Link
                  href={`/${locale}/orders`}
                  onClick={() => setOpenMenu(false)}
                  className={`nav-link ${
                    pathname.startsWith(`/${locale}/orders`)
                      ? "nav-link-active"
                      : ""
                  }`}
                >
                  {translations.orders.title}
                </Link>
              </li>
            )}
          </>
        )}

        <li className="mt-2 flex flex-col gap-4 border-t border-border pt-6 lg:hidden">
          <div onClick={() => setOpenMenu(false)}>
            <AuthButtons
              translations={translations}
              initialSession={initialSession}
            />
          </div>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
