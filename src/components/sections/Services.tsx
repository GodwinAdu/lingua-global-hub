'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Languages, 
  Mic2, 
  PlayCircle, 
  Music, 
  FileEdit, 
  PenTool,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Service } from '@/lib/content/site-types';
import { getIcon } from '@/lib/content/icons';
import type { HomeSection } from '@/lib/content/home';
import { SiteImage } from '@/components/seo/site-image';



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9] as const
    },
  },
};

export const Services = ({ items, section }: { items: Service[]; section: HomeSection }) => {
  const c = section.content;
  const services = items.map((s) => ({
    icon: getIcon(s.icon),
    title: s.card_title || s.title,
    description: s.card_description || s.summary,
    image: s.image_url || '/placeholder.svg',
    href: `/services/${s.slug}`,
  }));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4"
          >
            {c.eyebrow}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            {c.title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            {c.intro}
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={service.href}>
                  <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:shadow-premium-lg">
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    />
                    
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      >
                        <SiteImage src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                      </motion.div>
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
                      
                      {/* Icon Overlay with glow */}
                      <motion.div 
                        className="absolute top-4 right-4 w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-glow"
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Icon className="w-7 h-7 text-secondary-foreground" />
                        
                        {/* Rotating ring */}
                        <motion.div
                          className="absolute inset-0 rounded-xl border-2 border-accent/40"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="relative p-6 z-20">
                      <motion.h3 
                        className="font-display text-xl font-bold text-foreground mb-3 group-hover:text-secondary transition-colors duration-300"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        {service.title}
                      </motion.h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                        {service.description}
                      </p>

                      {/* Link with arrow animation */}
                      <motion.div 
                        className="flex items-center gap-2 text-sm font-semibold text-secondary group-hover:gap-3 transition-all duration-300"
                      >
                        <span>Learn more</span>
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Bottom gradient accent */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-accent to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button variant="premium" size="lg" asChild>
              <Link href="/services">
                {c.button_label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
