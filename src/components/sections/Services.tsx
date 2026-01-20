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
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Import service images
import translationImg from '@/assets/service-translation.jpg';
import interpretationImg from '@/assets/service-interpretation.jpg';
import voiceoverImg from '@/assets/service-voiceover.jpg';
import jingleImg from '@/assets/service-jingle.jpg';
import editingImg from '@/assets/service-editing.jpg';
import scriptwritingImg from '@/assets/service-scriptwriting.jpg';

const services = [
  {
    icon: Languages,
    title: 'Translation',
    description: 'Accurate, culturally-sensitive translations across 50+ languages for documents, websites, and marketing materials.',
    image: translationImg,
    href: '/services/translation',
  },
  {
    icon: Mic2,
    title: 'Interpretation',
    description: 'Professional simultaneous and consecutive interpretation for conferences, meetings, and official events.',
    image: interpretationImg,
    href: '/services/interpretation',
  },
  {
    icon: PlayCircle,
    title: 'Voice-over',
    description: 'Studio-quality voice-over production in multiple languages for commercials, documentaries, and e-learning.',
    image: voiceoverImg,
    href: '/services/voiceover',
  },
  {
    icon: Music,
    title: 'Jingle Recording',
    description: 'Custom jingle creation and recording with professional vocalists and sound engineers.',
    image: jingleImg,
    href: '/services/jingle',
  },
  {
    icon: FileEdit,
    title: 'Editing',
    description: 'Comprehensive editing and proofreading services ensuring flawless content delivery.',
    image: editingImg,
    href: '/services/editing',
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    description: 'Creative script development for commercials, corporate videos, and multimedia productions.',
    image: scriptwritingImg,
    href: '/services/scriptwriting',
  },
];

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
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
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
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4"
          >
            Our Services
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6"
          >
            Comprehensive Language & Media Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            From translation to voice production, we provide end-to-end services 
            that help your message resonate across cultures and borders.
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
              >
                <Link to={service.href}>
                  <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:shadow-premium-lg">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      {/* Icon Overlay */}
                      <motion.div 
                        className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-secondary/90 flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </motion.div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-secondary transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {service.description}
                      </p>

                      {/* Link */}
                      <motion.div 
                        className="flex items-center gap-2 text-sm font-medium text-secondary"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at 50% 0%, hsl(217 91% 50% / 0.1) 0%, transparent 50%)',
                      }}
                    />
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
              <Link to="/services">
                View All Services
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
