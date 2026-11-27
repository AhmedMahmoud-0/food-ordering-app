"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingBasket, RotateCcw, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const { locale } = useParams<{ locale: string }>();
  const isArabic = locale === "ar";

  useEffect(() => {
    console.error("Cart route error:", error);
  }, [error]);

  return (
    <main>
      <section className="page-section">
        <div className="container">
          <div className="surface-card mx-auto flex min-h-80 max-w-2xl flex-col items-center justify-center px-6 py-12 text-center">
            <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-secondary text-primary">
              <ShoppingBasket className="size-7" aria-hidden="true" />
            </span>

            <h1 className="text-xl font-extrabold text-foreground sm:text-2xl">
              {isArabic ? "تعذر تحميل سلة المشتريات" : "We couldn't load your cart"}
            </h1>

            <p className="mt-3 max-w-md text-sm leading-7 text-muted-foreground">
              {isArabic
                ? "حدث خطأ مؤقت أثناء فتح السلة. حاول إعادة تحميلها، ولن يتم حذف المنتجات المحفوظة بسبب هذه المحاولة."
                : "A temporary error occurred while opening your cart. Try loading it again. Your saved cart items are not removed by this retry."}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button type="button" onClick={reset}>
                <RotateCcw aria-hidden="true" />
                {isArabic ? "حاول مرة أخرى" : "Try again"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/${locale}/menu`)}
              >
                <UtensilsCrossed aria-hidden="true" />
                {isArabic ? "العودة إلى القائمة" : "Back to menu"}
              </Button>
            </div>

            {error.digest && (
              <p className="mt-6 text-xs text-muted-foreground">
                {isArabic ? "رمز الخطأ:" : "Error reference:"} {error.digest}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
