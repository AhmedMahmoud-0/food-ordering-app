import { Category } from "@prisma/client";
import EditCategory from "./EditCategory";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import DeleteCategory from "./DeleteCategory";
import { Tags } from "lucide-react";

async function CategoryItem({ category }: { category: Category }) {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  return (
    <li className="group flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-border/75 bg-background/75 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-card hover:shadow-[0_10px_25px_rgba(52,35,22,0.055)] sm:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="element-center size-10 shrink-0 rounded-xl bg-secondary text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
          <Tags className="size-4" />
        </span>
        <h3 className="min-w-0 break-words text-sm font-extrabold text-foreground sm:text-base">
          {category.name}
        </h3>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <EditCategory translations={translations} category={category} />
        <DeleteCategory id={category.id} />
      </div>
    </li>
  );
}

export default CategoryItem;
