import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
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
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Languages,
    title: 'Translation',
    description: 'Accurate, culturally-sensitive translations across 50+ languages for documents, websites, and marketing materials.',
    color: 'secondary',
  },
  {
    icon: Mic2,
    title: 'Interpretation',
    description: 'Professional simultaneous and consecutive interpretation for conferences, meetings, and official events.',
    color: 'accent',
  },
  {
    icon: PlayCircle,
    title: 'Voice-over',
    description: 'Studio-quality voice-over production in multiple languages for commercials, documentaries, and e-learning.',
    color: 'secondary',
  },
  {
    icon: Music,
    title: 'Jingle Recording',
    description: 'Custom jingle creation and recording with professional vocalists and sound engineers.',
    color: 'accent',
  },
  {
    icon: FileEdit,
    title: 'Editing',
    description: 'Comprehensive editing and proofreading services ensuring flawless content delivery.',
    color: 'secondary',
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    description: 'Creative script development for commercials, corporate videos, and multimedia productions.',
    color: 'accent',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const Services = () => {
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
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Comprehensive Language & Media Solutions
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From translation to voice production, we provide end-to-end services 
            that help your message resonate across cultures and borders.
          </p>
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
            const isSecondary = service.color === 'secondary';
            
            return (
              <motion.div
                key={service.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="relative h-full p-8 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-all duration-500 hover:shadow-premium-lg overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    isSecondary ? 'bg-gradient-to-br from-secondary/5 to-transparent' : 'bg-gradient-to-br from-accent/5 to-transparent'
                  }`} />
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                    isSecondary ? 'bg-secondary/10 text-secondary' : 'bg-accent/10 text-accent'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3 className="relative font-display text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="relative text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Link */}
                  <div className="relative flex items-center gap-2 text-sm font-medium text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="premium" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
