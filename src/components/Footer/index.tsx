import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";

const Footer = async () => {
  const locale = await getCurrentLocale();
  const { copyRight, logo } = await getTrans(locale);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-brand">
          <span className="footer-brand-mark" aria-hidden="true">
            🍕
          </span>
          <span>{logo}</span>
        </p>
        <p className="footer-copy">{copyRight}</p>
      </div>
    </footer>
  );
};

export default Footer;
