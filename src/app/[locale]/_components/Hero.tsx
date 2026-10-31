import Link from "@/components/link";
import { buttonVariants } from "@/components/ui/button";
import { Languages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { ArrowRight, CircleArrowRight } from "lucide-react";
import Image from "next/image";

async function Hero() {
  const locale = await getCurrentLocale();
  const { home } = await getTrans(locale);
  const { hero } = home;

  return (
    <section className="hero-section">
      <div className="container hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-actions">
            <Link
              href={`/${Routes.MENU}`}
              className={`${buttonVariants({ size: "lg" })} hero-primary-action !h-[3.25rem] !rounded-full !px-7`}
            >
              {hero.orderNow}
              <ArrowRight
                className={`size-5 ${
                  locale === Languages.ARABIC ? "rotate-180" : ""
                }`}
              />
            </Link>
            <Link
              href={`/${Routes.ABOUT}`}
              className="hero-secondary-action"
            >
              {hero.learnMore}
              <CircleArrowRight
                className={`size-5 ${
                  locale === Languages.ARABIC ? "rotate-180" : ""
                }`}
              />
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <Image
            src="/assets/images/pizza.png"
            alt="Pizza"
            fill
            className="hero-pizza-image"
            loading="eager"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
