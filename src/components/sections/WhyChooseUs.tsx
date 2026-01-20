import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Zap, HeartHandshake, BadgeCheck, Clock4, Headphones } from 'lucide-react';

const features = [
  {
    icon: BadgeCheck,
    title: 'Certified Experts',
    description: 'Our linguists hold internationally recognized certifications and bring years of specialized experience.',
  },
  {
    icon: Shield,
    title: 'Confidentiality Guaranteed',
    description: 'Rigorous data protection protocols ensure your sensitive information remains secure at all times.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Efficient processes and dedicated teams ensure timely delivery without compromising quality.',
  },
  {
    icon: HeartHandshake,
    title: 'Client-Centric Approach',
    description: 'We tailor every project to your specific needs, ensuring complete satisfaction and lasting partnerships.',
  },
  {
    icon: Clock4,
    title: '24/7 Availability',
    description: 'Round-the-clock support means we\'re ready whenever you need us, across any time zone.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Personal project managers guide you through every step, from briefing to final delivery.',
  },
];

export const WhyChooseUs = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Gradient Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-secondary/10 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 to-transparent" />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
            Why Choose Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            The First Grade Advantage
          </h2>
          <p className="text-lg text-primary-foreground/70 leading-relaxed">
            Experience the difference that commitment to excellence makes. 
            We don't just meet expectations—we exceed them.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-secondary/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-6 group-hover:bg-secondary/30 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-primary-foreground/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
