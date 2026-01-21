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
    description: 'Accurate translations in 50+ Ghanaian languages including Akan, Ga, Ewe, Dagbani, and major international languages for documents, websites, and marketing materials.',
    image: translationImg,
    href: '/services/translation',
  },
  {
    icon: Mic2,
    title: 'Interpretation',
    description: 'Professional simultaneous and consecutive interpretation in Ghanaian languages for conferences, meetings, community events, and official proceedings.',
    image: interpretationImg,
    href: '/services/interpretation',
  },
  {
    icon: PlayCircle,
    title: 'Voice-over',
    description: 'Studio-quality voice-over production in multiple Ghanaian languages for radio, TV commercials, documentaries, and educational content.',
    image: voiceoverImg,
    href: '/services/voiceover',
  },
  {
    icon: Music,
    title: 'Jingle Recording',
    description: 'Custom jingle creation and recording in local languages with professional vocalists who understand Ghanaian musical traditions and sound engineering.',
    image: jingleImg,
    href: '/services/jingle',
  },
  {
    icon: FileEdit,
    title: 'Language Documentation',
    description: 'Comprehensive documentation and preservation of indigenous Ghanaian languages, including grammar guides, dictionaries, and digital archives.',
    image: editingImg,
    href: '/services/editing',
  },
  {
    icon: PenTool,
    title: 'Script Writing',
    description: 'Creative script development in Ghanaian languages for commercials, educational videos, cultural programs, and multimedia productions.',
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
  hidden: { opacity: 0, y: 60, scale: 0.9, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { 
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9]
    },
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
            Comprehensive Language Documentation & Media Solutions
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground leading-relaxed"
          >
            From translation to voice production in Ghana's diverse languages, we provide end-to-end services 
            that help preserve linguistic heritage and ensure your message resonates across cultures.
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
                <Link to={service.href}>
                  <div className="relative h-full rounded-2xl bg-card border border-border overflow-hidden hover:border-secondary/50 transition-all duration-500 hover:shadow-premium-lg">
                    {/* Gradient overlay on hover */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                    />
                    
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      />
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
