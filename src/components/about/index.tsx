import { Routes } from "@/constants/enums";
import MainHeading from "../main-heading";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";

async function About() {
  const locale = await getCurrentLocale();
  const { home } = await getTrans(locale);
  const { about } = home;

  return (
    <section className="home-about-section" id={Routes.ABOUT}>
      <div className="container">
        <div className="surface-card home-about-card">
          <MainHeading subTitle={about.ourStory} title={about.aboutUs} />
          <div className="home-about-copy">
            <p>{about.descriptions.one}</p>
            <p>{about.descriptions.two}</p>
            <p>{about.descriptions.three}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
