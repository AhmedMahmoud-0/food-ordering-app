import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getUserOrders } from "@/server/db/orders";
import { Routes } from "@/constants/enums";
import { Button } from "@/components/ui/button";

async function OrdersPage() {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const orders = await getUserOrders();

  const { orders: ordersTranslation } = translations;
  const { details } = translations.admin.orders;

  return (
    <section className="section-gap">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-primary">
          {ordersTranslation.title}
        </h1>

        {orders.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-md border p-8 text-center">
            <ShoppingCartIcon className="mb-4 size-12 text-muted-foreground" />

            <p className="text-lg font-medium text-muted-foreground">
              {ordersTranslation.noOrders}
            </p>

            <Button asChild variant="outline" className="mt-4">
              <Link href={`/${locale}/${Routes.MENU}`}>
                {translations.navbar.menu}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-4">{ordersTranslation.orderId}</th>
                  <th className="p-4">{ordersTranslation.date}</th>
                  <th className="p-4">{ordersTranslation.total}</th>
                  <th className="p-4">{ordersTranslation.payment}</th>
                  <th className="p-4">{ordersTranslation.status}</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="p-4 font-medium">
                      <Link
                        href={`/${locale}/orders/${order.id}`}
                        className="font-medium underline underline-offset-4 hover:text-primary"
                      >
                        {order.id.slice(0, 8)}
                      </Link>
                    </td>

                    <td className="p-4">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(order.createdAt)}
                    </td>

                    <td className="p-4">
                      {new Intl.NumberFormat(locale, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(order.totalPrice)}
                    </td>

                    <td className="p-4">
                      {details.paymentStatuses[order.paymentStatus]}
                    </td>

                    <td className="p-4">
                      {details.statuses[order.orderStatus]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default OrdersPage;
