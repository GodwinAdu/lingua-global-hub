'use client';

import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TrendingUp, Users, Globe2, Award } from 'lucide-react';
import type { HomeSection } from '@/lib/content/home';
import { getIcon } from '@/lib/content/icons';
import { parseCount } from '@/lib/content/home';

const COLORS = ["text-accent", "text-secondary", "text-accent", "text-secondary"];

const AnimatedCounter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: 2000 });
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, motionValue, value]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
};

export const StatsCounter = ({ section }: { section: HomeSection }) => {
  const stats = section.items.map((item, i) => {
    const { number, prefix, suffix } = parseCount(item.value);
    return { value: number, prefix, suffix, raw: item.value, label: item.title, icon: getIcon(item.icon), color: COLORS[i % COLORS.length] };
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-20 bg-gradient-to-br from-primary via-primary to-primary/90 overflow-hidden">
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div className="container-premium relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={`${stat.label}-${index}`}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 mb-4 group-hover:bg-primary-foreground/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </motion.div>
                <div className="font-display text-4xl lg:text-5xl font-bold text-primary-foreground mb-2">
                  {stat.value === null ? stat.raw : <>{stat.prefix}<AnimatedCounter value={stat.value} suffix={stat.suffix} /></>}
                </div>
                <div className="text-primary-foreground/70 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
