import MainHeading from "@/components/main-heading";
import { Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";

const Contact = async () => {
  const locale = await getCurrentLocale();
  const { home } = await getTrans(locale);
  const { contact } = home;

  return (
    <section className="home-contact-section" id={Routes.CONTACT}>
      <div className="container">
        <div className="surface-card home-contact-card">
          <MainHeading
            subTitle={contact["Don'tHesitate"]}
            title={contact.contactUs}
          />
          <div className="mt-2">
            <a className="contact-phone-link" href="tel:+2012121212">
              +2012121212
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
