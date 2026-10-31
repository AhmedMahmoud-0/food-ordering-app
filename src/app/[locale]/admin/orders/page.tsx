import Link from "next/link";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getAdminOrders } from "@/server/db/orders";
import { formatCurrency } from "@/lib/formatters";

function paymentStatusClass(status: string) {
  if (status === "PAID") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "FAILED") return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

function orderStatusClass(status: string) {
  if (status === "DELIVERED") return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
  if (status === "CANCELLED") return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
  if (status === "PREPARING" || status === "OUT_FOR_DELIVERY") {
    return "bg-sky-50 text-sky-700 ring-1 ring-sky-200";
  }
  if (status === "CONFIRMED") return "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200";
  return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
}

async function OrdersPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const orders = await getAdminOrders();
  const { orders: ordersTranslation } = translations.admin;

  return (
    <section className="py-8 md:py-10">
      <div className="container admin-shell">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">{ordersTranslation.title}</span>
            <h1 className="section-title">{ordersTranslation.title}</h1>
          </div>
          <span className="rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-extrabold text-muted-foreground shadow-sm">
            {orders.length}
          </span>
        </div>

        <div className="data-table-wrap rounded-[1.5rem] border-border/80 shadow-[0_12px_32px_rgba(52,35,22,0.05)]">
          <table className="data-table min-w-[900px]">
            <thead>
              <tr>
                <th>{ordersTranslation.orderId}</th>
                <th>{ordersTranslation.customer}</th>
                <th>{ordersTranslation.date}</th>
                <th>{ordersTranslation.items}</th>
                <th>{ordersTranslation.total}</th>
                <th>{ordersTranslation.payment}</th>
                <th>{ordersTranslation.status}</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center font-semibold text-muted-foreground">
                    {ordersTranslation.noOrders}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link
                        href={`/${locale}/admin/orders/${order.id}`}
                        className="status-pill whitespace-nowrap border border-primary/20 bg-primary/5 text-primary no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-[0_8px_18px_rgba(200,59,48,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                      >
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>
                    <td className="max-w-48">
                      <span className="block truncate font-semibold text-foreground">
                        {order.user?.name || order.userEmail || order.phone}
                      </span>
                    </td>
                    <td className="whitespace-nowrap text-muted-foreground">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(order.createdAt)}
                    </td>
                    <td>
                      <span className="element-center size-8 rounded-lg bg-secondary text-xs font-extrabold text-foreground">
                        {order.products.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap font-extrabold text-foreground">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td>
                      <span className={`status-pill whitespace-nowrap ${paymentStatusClass(order.paymentStatus)}`}>
                        {ordersTranslation.details.paymentStatuses[order.paymentStatus]}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill whitespace-nowrap ${orderStatusClass(order.orderStatus)}`}>
                        {ordersTranslation.details.statuses[order.orderStatus]}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default OrdersPage;
