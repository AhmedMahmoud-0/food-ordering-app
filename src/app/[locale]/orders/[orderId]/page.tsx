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

async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderId } = await params;

  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const order = await getUserOrderById(orderId);

  if (!order) {
    notFound();
  }

  const { details } = translations.admin.orders;

  return (
    <section className="section-gap">
      <div className="container">
        <h1 className="mb-8 text-3xl font-bold text-primary">
          {details.title}
        </h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-md border p-6">
            <h2 className="mb-4 text-xl font-semibold">{details.customer}</h2>

            <div className="grid gap-3">
              <p>
                <span className="font-medium">{details.phone}: </span>
                {order.phone}
              </p>

              <p>
                <span className="font-medium">{details.address}: </span>
                {order.streetAddress}
              </p>

              <p>
                <span className="font-medium">{details.building}: </span>
                {order.building}
              </p>

              <p>
                <span className="font-medium">{details.city}: </span>
                {order.city}
              </p>

              <p>
                <span className="font-medium">{details.notes}: </span>
                {order.deliveryNotes || details.notAvailable}
              </p>
            </div>
          </div>

          <div className="rounded-md border p-6">
            <h2 className="mb-4 text-xl font-semibold">{details.items}</h2>

            <div className="grid gap-4">
              {order.products.map((item) => {
                const size = item.size as {
                  name?: string;
                  price?: number;
                } | null;

                const extras =
                  (item.extras as {
                    name: string;
                    price: number;
                  }[]) || [];

                return (
                  <div key={item.id} className="border-b pb-4 last:border-0">
                    <p className="font-semibold">{item.product.name}</p>

                    {size && (
                      <p className="text-sm">
                        {details.size}: {size.name}
                      </p>
                    )}

                    {extras.length > 0 && (
                      <p className="text-sm">
                        {details.extras}:{" "}
                        {extras.map((extra) => extra.name).join(", ")}
                      </p>
                    )}

                    <div className="mt-2 grid gap-1 text-sm">
                      <p>
                        {details.quantity}: {item.quantity}
                      </p>

                      <p>
                        {details.unitPrice}: {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-md border p-6 lg:col-span-2">
            <div className="grid gap-3">
              <p>
                <span className="font-medium">{details.paymentStatus}: </span>
                {details.paymentStatuses[order.paymentStatus]}
              </p>

              <p>
                <span className="font-medium">{details.orderStatus}: </span>
                {details.statuses[order.orderStatus]}
              </p>

              <p>
                <span className="font-medium">{details.subtotal}: </span>
                {formatCurrency(order.subTotal)}
              </p>

              <p>
                <span className="font-medium">{details.deliveryFee}: </span>
                {formatCurrency(order.deliveryFee)}
              </p>

              <p className="text-lg font-bold">
                <span>{details.total}: </span>
                {formatCurrency(order.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderDetailsPage;
