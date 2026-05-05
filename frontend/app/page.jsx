import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { ServicesPreview } from "@/components/home/services-preview"
import { FeaturedProject } from "@/components/home/featured-project"
import { PartnersSection } from "@/components/home/partners-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesPreview />
        <FeaturedProject />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
