import { Translations } from "@/types/translations";
import MenuItem from "./MenuItem";
import { ProductWithRelations } from "@/types/Product";

function Menu({
  items,
  translations,
}: {
  items: ProductWithRelations[];
  translations: Translations;
}) {
  return items.length > 0 ? (
    <ul className="product-grid">
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          translations={translations}
          priority={index === 0}
        />
      ))}
    </ul>
  ) : (
    <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
      {translations.noProductsFound}
    </p>
  );
}

export default Menu;
