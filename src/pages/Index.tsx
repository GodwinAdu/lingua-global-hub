import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import StatsCounter from '@/components/sections/StatsCounter';
import LanguageMarquee from '@/components/sections/LanguageMarquee';
import GhanaLanguages from '@/components/sections/GhanaLanguages';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import FeaturesShowcase from '@/components/sections/FeaturesShowcase';
import TrustBadges from '@/components/sections/TrustBadges';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import Process from '@/components/sections/Process';
import Testimonials from '@/components/sections/Testimonials';
import CTA from '@/components/sections/CTA';
import FloatingChat from '@/components/sections/FloatingChat';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <StatsCounter />
        <LanguageMarquee />
        <GhanaLanguages />
        <About />
        <Services />
        <FeaturesShowcase />
        <TrustBadges />
        <WhyChooseUs />
        <Process />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Index;
