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
  const productName =
    translations.products.items[item.id]?.name ?? item.name;
  const productDescription =
    translations.products.items[item.id]?.description ?? item.description;

  return (
    <li className="product-card menu-product-card">
      <div className="product-image-wrap menu-product-image-wrap">
        <Image
          src={item.image}
          className="product-image"
          alt={productName}
          fill
          priority={priority}
          sizes="(max-width: 639px) 78vw, (max-width: 1023px) 42vw, 28vw"
        />
      </div>

      <div className="product-card-heading menu-product-card-heading">
        <h3 className="product-card-title">{productName}</h3>
        <strong className="product-card-price">
          {formatCurrency(item.basePrice)}
        </strong>
      </div>

      <p className="product-card-description menu-product-card-description line-clamp-3">
        {productDescription}
      </p>

      <AddToCartButton item={item} translations={translations} />
    </li>
  );
}

export default MenuItem;
