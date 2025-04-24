import Hero from "@/components/landing-page/hero";
import CategorySelection from "@/components/landing-page/category-selection";
import FeaturedProducts from "@/components/landing-page/featured-products";
import SummerSale from "@/components/landing-page/summer-sale";
import InfoCards from "@/components/landing-page/info-card";

export default async function Page() {
  return (
    <>
      <Hero />
      <CategorySelection />
      <FeaturedProducts />
      <InfoCards />
      <SummerSale />
    </>
  );
}
