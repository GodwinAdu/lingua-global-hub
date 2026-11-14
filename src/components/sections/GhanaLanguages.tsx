'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Globe2, Users, BookOpen, Mic } from 'lucide-react';
import type { HomeSection } from '@/lib/content/home';
import { getIcon } from '@/lib/content/icons';

const COLORS = ["from-blue-500 to-cyan-500", "from-green-500 to-emerald-500", "from-purple-500 to-pink-500", "from-orange-500 to-red-500"];

export const GhanaLanguages = ({ section }: { section: HomeSection }) => {
  const c = section.content;
  const languageGroups = section.items.map((item, i) => ({
    name: item.title,
    languages: item.items,
    speakers: item.value,
    icon: getIcon(item.icon),
    color: COLORS[i % COLORS.length],
  }));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--secondary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="container-premium relative z-10">
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

        {/* Language Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {languageGroups.map((group, index) => {
            const Icon = group.icon;
            return (
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-secondary/30 hover:shadow-premium-md transition-all duration-300"
              >
                {/* Gradient overlay */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${group.color} opacity-5 rounded-2xl blur-2xl group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className="relative">
                  {/* Icon */}
                  <motion.div 
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                    {group.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 font-semibold">
                    {group.speakers} speakers
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.languages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground border border-border"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Languages Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center p-8 rounded-2xl bg-muted/50 border border-border"
        >
          <p className="text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">{c.extra_title}</span> {c.extra_text}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default GhanaLanguages;
