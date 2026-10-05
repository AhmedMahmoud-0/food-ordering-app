import Menu from "@/components/menu";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getProductsByCategory } from "@/server/db/products";

async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const categorites = await getProductsByCategory();
  return (
    <main>
      {categorites.length > 0 ? (
        categorites.map((category) => (
          <section key={category.id} className="section-gap">
            <div className="container text-center">
              <h1 className="text-primary font-bold text-4xl italic mb-6">
                {translations.products.categories[
                  category.id as keyof typeof translations.products.categories
                ] ?? category.name}
              </h1>
              <Menu items={category.products} translations={translations} />
            </div>
          </section>
        ))
      ) : (
        <p className="text-accent text-center py-20">
          {translations.noProductsFound}
        </p>
      )}
    </main>
  );
}

export default MenuPage;
