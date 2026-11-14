'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Zap, 
  Shield, 
  Clock, 
  Award, 
  Headphones, 
  Globe2,
  ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import type { HomeSection } from '@/lib/content/home';
import { getIcon } from '@/lib/content/icons';

const GRADIENTS = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-orange-500 to-red-500", "from-yellow-500 to-orange-500", "from-green-500 to-emerald-500", "from-indigo-500 to-purple-500"];
const SIZES = ["large", "small", "small", "medium", "medium", "large"];

export const FeaturesShowcase = ({ section }: { section: HomeSection }) => {
  const c = section.content;
  const features = section.items.map((item, i) => ({
    icon: getIcon(item.icon),
    title: item.title,
    description: item.description,
    gradient: GRADIENTS[i % GRADIENTS.length],
    size: SIZES[i % SIZES.length],
  }));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-premium relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {c.eyebrow}
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            {c.title}{' '}
            <span className="gradient-text">{c.highlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {c.intro}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colSpan = feature.size === 'large' ? 'lg:col-span-2' : feature.size === 'medium' ? 'md:col-span-1' : '';
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative p-8 rounded-2xl bg-card border border-border hover:border-secondary/50 transition-all duration-500 overflow-hidden ${colSpan}`}
              >
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Icon */}
                <motion.div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 shadow-lg`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>

                {/* Hover arrow */}
                <motion.div
                  className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ x: -10 }}
                  whileHover={{ x: 0 }}
                >
                  <ArrowRight className="w-5 h-5 text-secondary" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
          >
            {c.button_label}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;
