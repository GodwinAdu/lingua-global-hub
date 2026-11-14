'use client';

import { motion } from 'framer-motion';
import { 
  Languages, 
  Mic2, 
  PlayCircle, 
  Music, 
  FileEdit, 
  PenTool,
  Check,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/content/site-types';
import { getIcon } from '@/lib/content/icons';



const ServicesPage = ({ items }: { items: Service[] }) => {
  const services = items.map((s) => ({
    id: s.slug,
    icon: getIcon(s.icon),
    title: s.title,
    description: s.summary || s.card_description,
    image: s.image_url || '/placeholder.svg',
    features: s.features,
  }));
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(43_74%_49%_/_0.1)_0%,_transparent_50%)]" />
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4"
              >
                Our Services
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Comprehensive Language & Media Solutions
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-primary-foreground/70 leading-relaxed"
              >
                From translation to voice production, we provide end-to-end services 
                that help your message resonate across cultures and borders.
              </motion.p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Services List */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <div className="space-y-24">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={service.id}
                    id={service.id}
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
                  >
                    {/* Image */}
                    <motion.div 
                      className={`relative ${isEven ? '' : 'lg:order-2'}`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-lg">
                        <motion.img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>
                      {/* Accent decorations */}
                      <div className={`absolute -z-10 w-full h-full rounded-2xl bg-secondary/10 ${isEven ? '-bottom-6 -right-6' : '-bottom-6 -left-6'}`} />
                    </motion.div>

                    {/* Content */}
                    <div className={isEven ? 'lg:order-2' : ''}>
                      <motion.div 
                        className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-8 h-8 text-secondary" />
                      </motion.div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {service.title}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, fIndex) => (
                          <motion.li 
                            key={feature} 
                            className="flex items-start gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: fIndex * 0.1 }}
                          >
                            <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-secondary" />
                            </div>
                            <span className="text-foreground/80">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="premium" size="lg" asChild>
                          <Link href={`/services/${service.id}`}>
                            Learn More
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
