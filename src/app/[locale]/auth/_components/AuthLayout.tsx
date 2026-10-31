import Image from "next/image";
import Link from "@/components/link";
import styles from "./AuthLayout.module.css";

interface AuthLayoutProps {
  title: string;
  prompt: string;
  switchLabel: string;
  switchHref: string;
  children: React.ReactNode;
}

function AuthLayout({
  title,
  prompt,
  switchLabel,
  switchHref,
  children,
}: AuthLayoutProps) {
  return (
    <main className={styles.authPage}>
      <div className={styles.authShell}>
        <section className={styles.authVisual} aria-hidden="true">
          <span className={styles.visualOrbit} />
          <span className={styles.visualDot} />
          <div className={styles.visualGlow} />
          <Image
            src="/assets/images/pizza.png"
            alt=""
            width={582}
            height={583}
            priority
            className={styles.visualPizza}
          />
          <span className={styles.visualStamp}>🍕</span>
        </section>

        <section className={styles.authPanel}>
          <div className={styles.authIcon} aria-hidden="true">
            🍕
          </div>
          <h1 className={styles.authTitle}>{title}</h1>
          <div className={styles.authFormContent}>{children}</div>
          <p className={styles.authSwitch}>
            <span>{prompt}</span>
            <Link href={switchHref} className={styles.authSwitchLink}>
              {switchLabel}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
