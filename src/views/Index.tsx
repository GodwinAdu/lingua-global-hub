'use client';

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
import type { HomePage } from '@/lib/content/home';
import type { Service, Testimonial } from '@/lib/content/site-types';

type Props = { home: HomePage; services: Service[]; testimonials: Testimonial[] };

const Index = ({ home, services, testimonials }: Props) => {
  // A section shows when it's switched on and, for list sections, has something to list.
  const show = (key: keyof HomePage, needsItems = false) =>
    home[key].visible && (!needsItems || home[key].items.length > 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {show('hero') && <Hero section={home.hero} />}
        {show('stats', true) && <StatsCounter section={home.stats} />}
        {show('marquee', true) && <LanguageMarquee section={home.marquee} />}
        {show('ghana_languages') && <GhanaLanguages section={home.ghana_languages} />}
        {show('about') && <About section={home.about} />}
        {show('services') && services.length > 0 && <Services items={services} section={home.services} />}
        {show('features', true) && <FeaturesShowcase section={home.features} />}
        {show('trust', true) && <TrustBadges section={home.trust} />}
        {show('why', true) && <WhyChooseUs section={home.why} />}
        {show('process', true) && <Process section={home.process} />}
        {show('testimonials') && testimonials.length > 0 && <Testimonials items={testimonials} section={home.testimonials} />}
        {show('cta') && <CTA section={home.cta} />}
      </main>
      <Footer />
      <FloatingChat />
    </div>
  );
};

export default Index;
