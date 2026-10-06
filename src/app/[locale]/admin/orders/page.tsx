import Link from "next/link";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getAdminOrders } from "@/server/db/orders";
import { formatCurrency } from "@/lib/formatters";

async function OrdersPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const orders = await getAdminOrders();

  const { orders: ordersTranslation } = translations.admin;

  return (
    <section className="section-gap">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-primary">
          {ordersTranslation.title}
        </h1>

        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">{ordersTranslation.orderId}</th>
                <th className="p-4">{ordersTranslation.customer}</th>
                <th className="p-4">{ordersTranslation.date}</th>
                <th className="p-4">{ordersTranslation.items}</th>
                <th className="p-4">{ordersTranslation.total}</th>
                <th className="p-4">{ordersTranslation.payment}</th>
                <th className="p-4">{ordersTranslation.status}</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-8 text-center text-muted-foreground"
                  >
                    {ordersTranslation.noOrders}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">
                      <Link
                        href={`/${locale}/admin/orders/${order.id}`}
                        className="font-medium underline underline-offset-4 hover:text-primary"
                      >
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>

                    <td className="p-4">
                      {order.user?.name || order.userEmail || order.phone}
                    </td>

                    <td className="p-4">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(order.createdAt)}
                    </td>

                    <td className="p-4">
                      {order.products.reduce(
                        (total, item) => total + item.quantity,
                        0,
                      )}
                    </td>

                    <td className="p-4">{formatCurrency(order.totalPrice)}</td>

                    <td className="p-4">
                      {
                        ordersTranslation.details.paymentStatuses[
                          order.paymentStatus
                        ]
                      }
                    </td>

                    <td className="p-4">
                      {ordersTranslation.details.statuses[order.orderStatus]}
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
