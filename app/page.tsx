import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { LevelCatalog } from "@/components/landing/LevelCatalog";
import { AccessBand } from "@/components/landing/AccessBand";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <LevelCatalog />
        <AccessBand />
      </main>
      <Footer />
    </>
  );
}
