import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import AddToCartButton from "./add-to-cart-button";
import { ProductWithRelations } from "@/types/Product";
import { Translations } from "@/types/translations";
function MenuItem({
  item,
  translations,
  priority,
}: {
  item: ProductWithRelations;
  translations: Translations;
  priority?: boolean;
}) {
  return (
    <li
      className="p-6 rounded-lg text-center
bg-white border border-gray-200
group hover:shadow-md hover:shadow-black/15
hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative w-48 h-48 mx-auto">
        <Image
          src={item.image}
          className="object-cover"
          alt={item.name}
          fill
          priority={priority}
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-xl my-3">
          {translations.products.items[item.id]?.name ?? item.name}
        </h4>
        <strong className="text-accent">
          {" "}
          {formatCurrency(item.basePrice)}
        </strong>
      </div>
      <p className="text-gray-500 text-sm line-clamp-3">
        {translations.products.items[item.id]?.description ?? item.description}
      </p>
      <AddToCartButton item={item} translations={translations} />
    </li>
  );
}

export default MenuItem;
