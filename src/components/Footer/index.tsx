import NextLink from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import styles from "./Footer.module.css";

const Footer = async () => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const { footer, navbar, cart, orders, logo, copyRight } = translations;

  const groups = [
    {
      id: "explore",
      title: footer.explore,
      links: [
        { label: navbar.home, href: `/${locale}` },
        { label: navbar.menu, href: `/${locale}/menu` },
      ],
    },
    {
      id: "company",
      title: footer.company,
      links: [
        { label: navbar.about, href: `/${locale}/about` },
        { label: navbar.contact, href: `/${locale}/contact` },
      ],
    },
    {
      id: "account",
      title: footer.orderAndAccount,
      links: [
        { label: cart.title, href: `/${locale}/cart` },
        { label: orders.title, href: `/${locale}/orders` },
        { label: navbar.profile, href: `/${locale}/profile` },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.invitation} aria-labelledby="footer-invitation-title">
          <div className={styles.invitationCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowMark} aria-hidden="true" />
              {footer.eyebrow}
            </p>
            <h2 id="footer-invitation-title" className={styles.invitationTitle}>
              {footer.ctaTitle}
            </h2>
            <p className={styles.invitationDescription}>
              {footer.ctaDescription}
            </p>
          </div>

          <NextLink className={styles.menuCta} href={`/${locale}/menu`} prefetch={false}>
            <span>{footer.ctaLink}</span>
            <ArrowUpRight className={styles.ctaIcon} aria-hidden="true" />
          </NextLink>
        </section>

        <div className={styles.footerMain}>
          <div className={styles.brandBlock}>
            <NextLink href={`/${locale}`} prefetch={false} className={styles.brandLink}>
              <span className={styles.brandMark} aria-hidden="true">
                🍕
              </span>
              <span className={styles.brandName}>{logo}</span>
            </NextLink>
            <p className={styles.brandDescription}>{footer.description}</p>
            <div className={styles.brandNote}>
              <span className={styles.brandNoteDot} aria-hidden="true" />
              <span>{footer.brandNote}</span>
            </div>
          </div>

          {groups.map((group) => (
            <nav
              key={group.id}
              className={styles.linkGroup}
              aria-label={group.title}
            >
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <ul className={styles.linkList}>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <NextLink className={styles.footerLink} href={link.href} prefetch={false}>
                      <span className={styles.linkMarker} aria-hidden="true">
                        ↗
                      </span>
                      <span>{link.label}</span>
                    </NextLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyRight}>{copyRight}</p>
          <p className={styles.bottomNote}>{footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
