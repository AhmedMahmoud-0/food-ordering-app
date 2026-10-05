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
    <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    <p className="text-accent text-center">No Products Found</p>
  );
}

export default Menu;
