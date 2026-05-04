import Navbar from '@/components/landing/Navbar'
import HeroSection from '@/components/landing/HeroSection'
import TrustSection from '@/components/landing/TrustSection'
import FeaturesSection from '@/components/landing/FeaturesSection'
import WorkflowSection from '@/components/landing/WorkflowSection'
import StyleGallerySection from '@/components/landing/StyleGallerySection'
import PricingSection from '@/components/landing/PricingSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import CTASection from '@/components/landing/CTASection'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <WorkflowSection />
        <StyleGallerySection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
