import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  PackageCheck,
  ReceiptText,
  ShoppingCartIcon,
} from "lucide-react";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getUserOrders } from "@/server/db/orders";
import { Routes } from "@/constants/enums";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

function getOrderStatusStyle(status: string) {
  if (status === "DELIVERED") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "CANCELLED") return "border-rose-200 bg-rose-50 text-rose-700";
  if (status === "OUT_FOR_DELIVERY") return "border-sky-200 bg-sky-50 text-sky-700";
  if (status === "PREPARING") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "CONFIRMED") return "border-teal-200 bg-teal-50 text-teal-700";
  return "border-border bg-secondary text-muted-foreground";
}

function getPaymentStatusStyle(status: string) {
  if (status === "PAID") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (status === "FAILED") return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

async function OrdersPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const orders = await getUserOrders();
  const { orders: ordersTranslation } = translations;
  const { details } = translations.admin.orders;

  return (
    <section className="page-section">
      <div className="container admin-shell">
        <div className="mb-8 flex flex-col gap-3 border-b border-border/70 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-eyebrow inline-flex items-center gap-2">
              <ReceiptText className="size-4" />
              {translations.navbar.profile}
            </span>
            <h1 className="section-title">{ordersTranslation.title}</h1>
          </div>
          {orders.length > 0 && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground shadow-sm">
              <PackageCheck className="size-4 text-primary" />
              {orders.length}
            </span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="surface-card flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
            <div className="element-center mb-5 size-20 rounded-full bg-secondary text-primary">
              <ShoppingCartIcon className="size-9" />
            </div>
            <p className="text-xl font-extrabold text-foreground">
              {ordersTranslation.noOrders}
            </p>
            <Button asChild className="mt-6 h-11 rounded-xl px-6 font-bold">
              <Link href={`/${locale}/${Routes.MENU}`}>
                {translations.navbar.menu}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <article
                key={order.id}
                className="surface-card overflow-hidden p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_44px_rgba(52,35,22,0.09)] sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-secondary px-3 py-1.5 font-mono text-sm font-bold tracking-wide text-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                        <CalendarDays className="size-4" />
                        {new Intl.DateTimeFormat(locale, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }).format(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`status-pill border ${getOrderStatusStyle(order.orderStatus)}`}>
                        {details.statuses[order.orderStatus]}
                      </span>
                      <span className={`status-pill border ${getPaymentStatusStyle(order.paymentStatus)}`}>
                        {details.paymentStatuses[order.paymentStatus]}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between lg:min-w-[300px] lg:border-s lg:border-t-0 lg:ps-6 lg:pt-0">
                    <div>
                      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {ordersTranslation.total}
                      </span>
                      <span className="text-2xl font-extrabold tracking-tight text-primary">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                    <Button asChild variant="outline" className="h-11 rounded-xl border-border px-4 font-bold">
                      <Link href={`/${locale}/orders/${order.id}`}>
                        {details.title}
                        <ArrowUpRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default OrdersPage;
