import { CapsuleUsage } from "@/components/capsule-usage";
import { HomeHero } from "@/components/home-hero";
import { ProductShop } from "@/components/product-shop";

export default function Home() {
  return (
    <>
      <HomeHero />
      <CapsuleUsage />
      <ProductShop />
    </>
  );
}
