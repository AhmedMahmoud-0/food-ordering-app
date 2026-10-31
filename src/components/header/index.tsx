import Link from "../link";
import Navbar from "./Navbar";
import CartButton from "./cart-button";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import LanguageSwitcher from "./language-switcher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import AuthButtons from "./auth-buttons";

async function Header() {
  const locale = await getCurrentLocale();
  const initialSession = await getServerSession(authOptions);
  const translations = await getTrans(locale);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href={`/${locale}`} className="brand-link">
          <span className="brand-mark" aria-hidden="true">
            🍕
          </span>
          <span>{translations.logo}</span>
        </Link>

        <Navbar translations={translations} initialSession={initialSession} />

        <div className="header-actions">
          <div className="desktop-header-tools hidden items-center gap-3 lg:flex">
            <div className="header-auth">
              <AuthButtons
                translations={translations}
                initialSession={initialSession}
              />
            </div>
            <LanguageSwitcher />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
}

export default Header;
