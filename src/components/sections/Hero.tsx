import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Play, Globe, Languages, Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBg from '@/assets/hero-bg.jpg';

const floatingIcons = [
  { Icon: Globe, delay: 0, x: '8%', y: '25%', size: 'w-14 h-14' },
  { Icon: Languages, delay: 0.3, x: '88%', y: '20%', size: 'w-12 h-12' },
  { Icon: Mic, delay: 0.6, x: '12%', y: '75%', size: 'w-10 h-10' },
  { Icon: Sparkles, delay: 0.9, x: '85%', y: '70%', size: 'w-8 h-8' },
];

const textRevealVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 50, rotateX: -90 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring' as const,
      damping: 12,
      stiffness: 100,
    },
  },
};

const AnimatedText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.span
      variants={textRevealVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          className="inline-block"
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y, scale }}
      >
        <img 
          src={heroBg} 
          alt="" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-primary/70" />
      </motion.div>

      {/* Animated Gradient Mesh Overlay */}
      <div className="absolute inset-0 z-[1]">
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,_hsl(217_91%_55%_/_0.4)_0%,_transparent_50%)]"
          animate={{ 
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_70%,_hsl(38_92%_50%_/_0.3)_0%,_transparent_50%)]"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1.3, 1, 1.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_hsl(280_70%_60%_/_0.2)_0%,_transparent_40%)]"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Floating Animated Icons */}
      {floatingIcons.map(({ Icon, delay, x, y, size }, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0, rotate: -180 }}
          animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.8, duration: 1, type: 'spring' }}
          className="absolute hidden lg:block z-[2]"
          style={{ left: x, top: y }}
        >
          <motion.div
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 4 + index, 
              repeat: Infinity, 
              ease: 'easeInOut',
            }}
          >
            <div className={`${size} rounded-2xl bg-gradient-to-br from-secondary/30 to-accent/20 backdrop-blur-md flex items-center justify-center border-2 border-primary-foreground/30 shadow-glow`}>
              <Icon className="w-1/2 h-1/2 text-primary-foreground drop-shadow-lg" />
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* Animated Particles */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'hsl(var(--accent))' : 'hsl(var(--secondary))',
            }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-[2]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div 
        className="container-premium relative z-10 pt-32 pb-20"
        style={{ opacity }}
      >
        <div className="max-w-4xl">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 backdrop-blur-sm mb-8"
          >
            <motion.div 
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-primary-foreground/80 font-medium">
              Ghana's Premier Language Consultancy
            </span>
          </motion.div>

          {/* Main Headline with Letter Animation */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6"
          >
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block"
            >
              Professional Language
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="block"
            >
             & Media Solutions for{' '}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative inline-block"
            >
              <span className="relative z-10 text-accent">Ghana & Beyond</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute bottom-2 left-0 right-0 h-3 bg-accent/20 -z-0 origin-left"
              />
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed max-w-2xl mb-10"
          >
            Specializing in Ghana's diverse languages including Akan, Ga, Ewe, Dagbani, and 50+ more. 
            We deliver exceptional translation, interpretation, voice-over, and media production services 
            to preserve and promote linguistic heritage across Ghana and Africa.
          </motion.p>

          {/* CTA Buttons with Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="hero-primary" size="xl" asChild>
                <Link to="/contact">
                  Request a Quote
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="hero-secondary" size="xl" asChild>
                <Link to="/services">
                  <Play className="w-4 h-4" />
                  Explore Our Services
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators with Stagger */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="mt-16 pt-10 border-t border-primary-foreground/10"
          >
            <p className="text-sm text-primary-foreground/50 mb-6 uppercase tracking-wider font-medium">
              Trusted by Industry Leaders
            </p>
            <div className="flex flex-wrap gap-x-12 gap-y-6 items-center">
              {['Ghana Gov Agencies', 'NGOs', 'Cultural Institutions', 'Media Houses', 'Corporate Clients'].map((client, index) => (
                <motion.div
                  key={client}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1 }}
                  whileHover={{ opacity: 1, scale: 1.05 }}
                  className="text-primary-foreground/70 font-display font-semibold text-sm tracking-wide cursor-default transition-all"
                >
                  {client}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-2 rounded-full bg-primary-foreground/50"
          />
        </motion.div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};

export default Hero;
