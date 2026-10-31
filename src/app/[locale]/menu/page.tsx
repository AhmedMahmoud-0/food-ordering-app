import Menu from "@/components/menu";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { getProductsByCategory } from "@/server/db/products";

async function MenuPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const categories = await getProductsByCategory();

  return (
    <main className="menu-page">
      {categories.length > 0 ? (
        <>
          <section className="menu-page-heading">
            <div className="container">
              <div className="menu-page-heading-content">
                <span className="menu-page-icon" aria-hidden="true">
                  🍕
                </span>
                <h1>{translations.navbar.menu}</h1>
              </div>
              <span className="menu-page-heading-line" aria-hidden="true" />
            </div>
          </section>

          {categories.map((category, index) => (
            <section
              key={category.id}
              className="menu-category-section"
              aria-labelledby={`menu-category-${category.id}`}
            >
              <div className="container">
                <div className="menu-category-heading">
                  <div className="menu-category-title-wrap">
                    <span className="menu-category-index" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2
                      id={`menu-category-${category.id}`}
                      className="menu-category-title"
                    >
                      {translations.products.categories[
                        category.id as keyof typeof translations.products.categories
                      ] ?? category.name}
                    </h2>
                  </div>

                  <span className="menu-category-count">
                    <span aria-hidden="true">🍕</span>
                    {category.products.length}
                  </span>
                </div>

                <Menu items={category.products} translations={translations} />
              </div>
            </section>
          ))}
        </>
      ) : (
        <section className="menu-empty-state container">
          <span className="menu-empty-icon" aria-hidden="true">
            🍕
          </span>
          <p>{translations.noProductsFound}</p>
        </section>
      )}
    </main>
  );
}

export default MenuPage;
