import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getAdminOrderById } from "@/server/db/orders";
import { notFound } from "next/navigation";
import OrderStatusSelect from "./_components/OrderStatusSelect";
import { formatCurrency } from "@/lib/formatters";
import { ArrowLeft, CalendarDays, CreditCard, MapPin, Package, ReceiptText, UserRound } from "lucide-react";

type OrderDetailsPageProps = {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
};

function paymentStatusClass(status: string) {
  if (status === "PAID") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "FAILED") return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params;
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const order = await getAdminOrderById(orderId);

  if (!order) {
    notFound();
  }

  const { details } = translations.admin.orders;

  return (
    <section className="py-8 md:py-10">
      <div className="container admin-shell">
        <div className="mb-7">
          <Link
            href={`/${locale}/admin/orders`}
            className={`${buttonVariants({ variant: "outline" })} mb-6 h-10 rounded-xl border-border/80 bg-card px-4 font-bold text-muted-foreground shadow-none hover:border-primary/20 hover:bg-primary/5 hover:text-primary`}
          >
            <ArrowLeft className={`size-4 ${locale === "ar" ? "rotate-180" : ""}`} />
            {translations.admin.tabs.orders}
          </Link>
          <span className="section-eyebrow">{details.title}</span>
          <h1 className="section-title">{details.title}</h1>
        </div>

        <div className="mb-5 grid gap-3 rounded-[1.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/55 p-5 shadow-[0_12px_32px_rgba(52,35,22,0.045)] sm:grid-cols-2 sm:p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="element-center size-10 shrink-0 rounded-xl bg-primary/10 text-primary">
              <ReceiptText className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">{details.orderId}</p>
              <p className="mt-1 break-all text-sm font-extrabold text-foreground">{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:justify-end">
            <span className="element-center size-10 shrink-0 rounded-xl bg-secondary text-muted-foreground">
              <CalendarDays className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-muted-foreground">{details.createdAt}</p>
              <p className="mt-1 text-sm font-bold text-foreground">
                {new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-2">
          <section className="surface-card min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-border/70 pb-4">
              <span className="element-center size-10 rounded-xl bg-secondary text-muted-foreground">
                <UserRound className="size-4" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">{details.customer}</h2>
            </div>
            <div className="grid gap-4 text-sm leading-6">
              {order.user?.name && (
                <p><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.name}</span><span className="font-semibold text-foreground">{order.user.name}</span></p>
              )}
              {order.user?.email && (
                <p className="min-w-0"><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.email}</span><span className="break-all font-semibold text-foreground">{order.user.email}</span></p>
              )}
              <p><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.phone}</span><span className="font-semibold text-foreground">{order.phone}</span></p>
              <p className="flex items-start gap-2"><MapPin className="mt-1 size-4 shrink-0 text-primary" /><span><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.address}</span><span className="font-semibold text-foreground">{order.streetAddress}</span></span></p>
              <div className="grid gap-4 sm:grid-cols-2">
                <p><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.building}</span><span className="font-semibold text-foreground">{order.building}</span></p>
                <p><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.city}</span><span className="font-semibold text-foreground">{order.city}</span></p>
              </div>
              <p><span className="mb-0.5 block text-xs font-bold text-muted-foreground">{details.notes}</span><span className="font-semibold text-foreground">{order.deliveryNotes || details.notAvailable}</span></p>
            </div>
          </section>

          <section className="surface-card min-w-0 p-5 sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-border/70 pb-4">
              <span className="element-center size-10 rounded-xl bg-secondary text-muted-foreground">
                <Package className="size-4" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">{details.items}</h2>
            </div>
            <div className="grid gap-4">
              {order.products.map((item) => {
                const size = item.size as { name?: string; price?: number } | null;
                const extras = (item.extras as { name: string; price: number }[]) || [];

                return (
                  <article key={item.id} className="rounded-2xl border border-border/70 bg-background/75 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="break-words text-sm font-extrabold text-foreground">{item.product.name}</h3>
                        {size && <p className="mt-1 text-xs font-medium text-muted-foreground">{details.size}: {size.name}</p>}
                        {extras.length > 0 && <p className="mt-1 text-xs leading-5 text-muted-foreground">{details.extras}: {extras.map((extra) => extra.name).join(", ")}</p>}
                      </div>
                      <span className="shrink-0 rounded-lg bg-secondary px-2.5 py-1 text-xs font-extrabold text-foreground">×{item.quantity}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs">
                      <span className="text-muted-foreground">{details.unitPrice}: {formatCurrency(item.unitPrice)}</span>
                      <span className="font-extrabold text-foreground">{details.total}: {formatCurrency(item.unitPrice * item.quantity)}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="surface-card min-w-0 p-5 sm:col-span-2 sm:p-7">
            <div className="mb-5 flex items-center gap-3 border-b border-border/70 pb-4">
              <span className="element-center size-10 rounded-xl bg-secondary text-muted-foreground">
                <CreditCard className="size-4" />
              </span>
              <h2 className="text-lg font-extrabold tracking-tight text-foreground">{details.paymentStatus}</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.75fr)]">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="mb-2 text-xs font-bold text-muted-foreground">{details.paymentStatus}</p>
                  <span className={`status-pill ${paymentStatusClass(order.paymentStatus)}`}>
                    {details.paymentStatuses[order.paymentStatus]}
                  </span>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <p className="mb-2 text-xs font-bold text-muted-foreground">{details.orderStatus}</p>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.orderStatus}
                    translations={{
                      statuses: details.statuses,
                      statusUpdateSuccess: translations.admin.orders.statusUpdateSuccess,
                      statusUpdateError: translations.admin.orders.statusUpdateError,
                    }}
                  />
                </div>
              </div>
              <div className="rounded-2xl bg-secondary/55 p-5">
                <div className="ml-auto grid max-w-sm gap-3 text-sm">
                  <p className="flex justify-between gap-4"><span className="text-muted-foreground">{details.subtotal}</span><span className="font-bold text-foreground">{formatCurrency(order.subTotal)}</span></p>
                  <p className="flex justify-between gap-4"><span className="text-muted-foreground">{details.deliveryFee}</span><span className="font-bold text-foreground">{formatCurrency(order.deliveryFee)}</span></p>
                  <p className="flex justify-between gap-4 border-t border-border pt-3 text-base font-extrabold"><span>{details.total}</span><span className="text-primary">{formatCurrency(order.totalPrice)}</span></p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
