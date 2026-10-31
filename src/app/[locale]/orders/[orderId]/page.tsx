import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ReceiptText,
  Truck,
} from "lucide-react";
import { Routes } from "@/constants/enums";
import { formatCurrency } from "@/lib/formatters";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getUserOrderById } from "@/server/db/orders";
import { notFound } from "next/navigation";

type OrderDetailsPageProps = {
  params: Promise<{
    locale: string;
    orderId: string;
  }>;
};

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

async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId, locale: routeLocale } = await params;
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const order = await getUserOrderById(orderId);

  if (!order) {
    notFound();
  }

  const { details } = translations.admin.orders;
  const orderDate = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(order.createdAt);

  return (
    <section className="page-section">
      <div className="container max-w-6xl">
        <Link
          href={`/${routeLocale}/${Routes.ORDERS}`}
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-muted-foreground shadow-sm hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {translations.orders.title}
        </Link>

        <div className="mb-7 flex flex-col gap-5 rounded-[1.75rem] border border-border/80 bg-linear-to-br from-card via-card to-secondary/60 p-6 shadow-[0_14px_38px_rgba(52,35,22,0.055)] sm:p-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <span className="section-eyebrow inline-flex items-center gap-2">
              <ReceiptText className="size-4" />
              {details.title}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              #{order.id.slice(0, 8)}
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              {orderDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`status-pill border px-4 py-2 ${getOrderStatusStyle(order.orderStatus)}`}>
              {details.statuses[order.orderStatus]}
            </span>
            <span className={`status-pill border px-4 py-2 ${getPaymentStatusStyle(order.paymentStatus)}`}>
              {details.paymentStatuses[order.paymentStatus]}
            </span>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <section className="surface-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
              <div className="element-center size-11 rounded-2xl bg-secondary text-primary">
                <MapPin className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">{details.customer}</h2>
                <p className="text-sm text-muted-foreground">{details.address}</p>
              </div>
            </div>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{details.phone}</dt>
                <dd className="wrap-break-word text-sm font-semibold text-foreground">{order.phone}</dd>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{details.address}</dt>
                <dd className="wrap-break-word text-sm font-semibold leading-6 text-foreground">{order.streetAddress}</dd>
              </div>
              <div className="min-w-0">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{details.building}</dt>
                <dd className="wrap-break-word text-sm font-semibold text-foreground">{order.building}</dd>
              </div>
              <div className="min-w-0">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{details.city}</dt>
                <dd className="wrap-break-word text-sm font-semibold text-foreground">{order.city}</dd>
              </div>
              <div className="min-w-0 sm:col-span-2">
                <dt className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">{details.notes}</dt>
                <dd className="wrap-break-word text-sm leading-6 text-foreground">{order.deliveryNotes || details.notAvailable}</dd>
              </div>
            </dl>
          </section>

          <section className="surface-card p-5 sm:p-7">
            <div className="mb-6 flex items-center gap-3 border-b border-border/70 pb-5">
              <div className="element-center size-11 rounded-2xl bg-secondary text-primary">
                <Package className="size-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-foreground">{details.items}</h2>
                <p className="text-sm text-muted-foreground">{order.products.length}</p>
              </div>
            </div>
            <div className="grid gap-5">
              {order.products.map((item, index) => {
                const size = item.size as { name?: string; price?: number } | null;
                const extras = (item.extras as { name: string; price: number }[]) || [];

                return (
                  <div key={item.id} className="flex gap-4 border-b border-border/70 pb-5 last:border-0 last:pb-0">
                    <div className="element-center size-10 shrink-0 rounded-xl bg-secondary text-sm font-extrabold text-primary">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-extrabold text-foreground">{item.product.name}</h3>
                        <span className="font-bold text-primary">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                      {size && <p className="mt-1 text-sm text-muted-foreground">{details.size}: {size.name}</p>}
                      {extras.length > 0 && (
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {details.extras}: {extras.map((extra) => extra.name).join(", ")}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-muted-foreground">
                        <span>{details.quantity}: {item.quantity}</span>
                        <span>{details.unitPrice}: {formatCurrency(item.unitPrice)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-7 lg:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <div className="element-center size-11 rounded-2xl bg-secondary text-primary">
                <CreditCard className="size-5" />
              </div>
              <h2 className="text-lg font-extrabold text-foreground">{details.paymentStatus}</h2>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_minmax(260px,0.65fr)] lg:items-start">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/35 p-4">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground">{details.paymentStatus}</p>
                    <p className="mt-1 text-sm font-extrabold text-foreground">{details.paymentStatuses[order.paymentStatus]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-secondary/35 p-4">
                  <Truck className="size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground">{details.orderStatus}</p>
                    <p className="mt-1 text-sm font-extrabold text-foreground">{details.statuses[order.orderStatus]}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-secondary/55 p-5">
                <div className="grid gap-3 text-sm">
                  <p className="flex justify-between gap-4"><span className="text-muted-foreground">{details.subtotal}</span><span className="font-semibold text-foreground">{formatCurrency(order.subTotal)}</span></p>
                  <p className="flex justify-between gap-4"><span className="text-muted-foreground">{details.deliveryFee}</span><span className="font-semibold text-foreground">{formatCurrency(order.deliveryFee)}</span></p>
                  <p className="flex justify-between gap-4 border-t border-border pt-4 text-base"><span className="font-extrabold text-foreground">{details.total}</span><span className="text-xl font-extrabold text-primary">{formatCurrency(order.totalPrice)}</span></p>
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
