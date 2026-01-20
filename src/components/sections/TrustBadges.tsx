import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, CheckCircle, Shield, Star } from 'lucide-react';

const badges = [
  {
    icon: Award,
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'ISO 27001',
    subtitle: 'Information Security',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: CheckCircle,
    title: 'ATA Certified',
    subtitle: 'Translation Standards',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Star,
    title: '5-Star Rated',
    subtitle: 'Client Satisfaction',
    color: 'from-yellow-500 to-orange-500',
  },
];

export const TrustBadges = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-16 bg-muted/20">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Trusted & Certified
          </span>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="group relative p-6 rounded-xl bg-card border border-border hover:border-secondary/30 transition-all duration-300 text-center"
              >
                <motion.div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${badge.color} mb-3 shadow-md`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="font-bold text-foreground text-sm mb-1">
                  {badge.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {badge.subtitle}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
