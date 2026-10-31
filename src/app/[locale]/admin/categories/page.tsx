import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getCategories } from "@/server/db/categories";
import Form from "./_components/Form";
import CategoryItem from "./_components/CategoryItem";

async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const locale = (await params).locale;
  const categories = await getCategories();
  const translations = await getTrans(locale);

  return (
    <main>
      <section className="py-8 md:py-10">
        <div className="container admin-shell">
          <div className="mb-8">
            <span className="section-eyebrow">{translations.admin.tabs.categories}</span>
            <h1 className="section-title">{translations.admin.tabs.categories}</h1>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.2fr)]">
            <div className="surface-card p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="element-center size-11 rounded-2xl bg-primary/10 text-primary">
                  <span className="text-lg font-black">+</span>
                </span>
                <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                  {translations.admin.categories.form.name.label}
                </h2>
              </div>
              <Form translations={translations} />
            </div>

            <div className="surface-card min-w-0 p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-3 border-b border-border/70 pb-4">
                <h2 className="text-lg font-extrabold tracking-tight text-foreground">
                  {translations.admin.tabs.categories}
                </h2>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-extrabold text-muted-foreground">
                  {categories.length}
                </span>
              </div>
              {categories.length > 0 ? (
                <ul className="grid gap-3">
                  {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </ul>
              ) : (
                <p className="rounded-2xl border border-dashed border-border bg-secondary/35 px-4 py-10 text-center text-sm font-medium text-muted-foreground">
                  {translations.noCategoriesFound}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;
