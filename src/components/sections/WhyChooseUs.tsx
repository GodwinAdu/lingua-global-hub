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
    <section ref={ref} className="relative py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary-foreground)) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>
      
      {/* Animated Gradient Accents */}
      <motion.div 
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-secondary/10 to-transparent"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-accent/5 to-transparent"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span 
            className="inline-flex items-center gap-2 text-sm font-bold text-accent uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Why Choose Us
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            The First Grade{' '}
            <span className="relative inline-block">
              <span className="gradient-text-gold">Advantage</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-3 bg-accent/20 -z-10 rounded"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </span>
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
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.6, 0.05, 0.01, 0.9] }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="relative p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 hover:border-secondary/30 transition-all duration-500 overflow-hidden">
                  {/* Gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Icon with animation */}
                  <motion.div 
                    className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/20 mb-6 group-hover:bg-secondary/30 transition-colors duration-500"
                    whileHover={{ rotate: 5, scale: 1.1 }}
                  >
                    <Icon className="w-7 h-7 text-secondary" />
                    
                    {/* Rotating ring */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-secondary/20"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                  </motion.div>
                  
                  <h3 className="relative font-display text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="relative text-primary-foreground/60 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                  
                  {/* Bottom accent */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
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
