import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";
import NewArrivals from "./_components/NewArrivals";

export default async function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <NewArrivals />
    </main>
  );
}
