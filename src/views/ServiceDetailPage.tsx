'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Languages, 
  Mic2, 
  PlayCircle, 
  Music, 
  FileEdit, 
  PenTool,
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  Clock,
  Award,
  Users
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/content/site-types';
import { getIcon } from '@/lib/content/icons';



const ServiceDetailPage = ({ serviceId, items }: { serviceId: string; items: Service[] }) => {
  const servicesData = Object.fromEntries(
    items.map((s) => [
      s.slug,
      {
        icon: getIcon(s.icon),
        title: s.title,
        subtitle: s.subtitle,
        description: s.description,
        image: s.image_url || '/placeholder.svg',
        features: s.features,
        stats: s.stats.map((st) => ({ ...st, icon: getIcon(st.icon) })),
        details: s.details,
      },
    ]),
  );
  const service = servicesData[serviceId as keyof typeof servicesData];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button asChild>
            <Link href="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const serviceKeys = Object.keys(servicesData);
  const currentIndex = serviceKeys.indexOf(serviceId || '');
  const prevService = currentIndex > 0 ? serviceKeys[currentIndex - 1] : null;
  const nextService = currentIndex < serviceKeys.length - 1 ? serviceKeys[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  href="/services" 
                  className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">All Services</span>
                </Link>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6"
              >
                <Icon className="w-8 h-8 text-secondary-foreground" />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4"
              >
                {service.subtitle}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                {service.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-primary-foreground/70 leading-relaxed"
              >
                {service.description}
              </motion.p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background -mt-10 relative z-10">
          <div className="container-premium">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {service.stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
                  >
                    <StatIcon className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                  What We Offer
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-foreground/80 text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-lg">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating accent */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-secondary/10 -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            >
              How We Deliver Excellence
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {service.details.map((detail, index) => (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {detail.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {detail.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container-premium">
            <div className="flex justify-between items-center">
              {prevService ? (
                <Link 
                  href={`/services/${prevService}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wider">Previous</div>
                    <div className="font-semibold">{servicesData[prevService as keyof typeof servicesData].title}</div>
                  </div>
                </Link>
              ) : <div />}
              
              {nextService && (
                <Link 
                  href={`/services/${nextService}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-right"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wider">Next</div>
                    <div className="font-semibold">{servicesData[nextService as keyof typeof servicesData].title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
