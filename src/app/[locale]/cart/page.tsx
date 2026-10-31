import { ShoppingBag } from "lucide-react";
import CartItems from "./_components/CartItems";
import CheckoutForm from "./_components/CheckoutForm";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";

async function CartPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return (
    <main>
      <section className="page-section">
        <div className="container">
          <header className="mb-9 flex flex-col items-center text-center sm:mb-11">
            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm">
              <ShoppingBag className="size-6" aria-hidden="true" />
            </span>
            <h1 className="section-title">{translations.cart.title}</h1>
          </header>

          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-7">
            <CartItems translations={translations} />
            <CheckoutForm translations={translations} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default CartPage;
