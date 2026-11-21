import MainHeading from "@/components/main-heading";
import Menu from "@/components/menu";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { getNewArrivals } from "@/server/db/products";

async function NewArrivals() {
  const newArrivals = await getNewArrivals(3);
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const heading = translations.home.newArrivals;

  return (
    <section className="page-section new-arrivals-section">
      <div className="container">
        <div className="page-section-heading">
          <MainHeading subTitle={heading.eyebrow} title={heading.title} />
        </div>
        <Menu items={newArrivals} translations={translations} />
      </div>
    </section>
  );
}

export default NewArrivals;
