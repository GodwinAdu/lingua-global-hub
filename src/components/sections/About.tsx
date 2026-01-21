import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Globe2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stats = [
  { value: '50+', label: 'Ghanaian Languages', icon: Globe2 },
  { value: '500+', label: 'Projects Delivered', icon: Award },
  { value: '100+', label: 'Corporate Clients', icon: Users },
  { value: '10+', label: 'Years Experience', icon: Clock },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="container-premium relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
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
              About Us
            </motion.span>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Preserving Ghana's{' '}
              <span className="relative inline-block">
                <span className="gradient-text-sunset">Linguistic Heritage</span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-secondary/20 via-accent/20 to-secondary/20 -z-10 rounded"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h2>
            
            <motion.p 
              className="text-lg text-muted-foreground leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              First Grade Lingua Consult is Ghana's premier language and media consultancy, 
              dedicated to documenting, preserving, and promoting the rich linguistic diversity 
              of Ghana's 50+ indigenous languages while bridging communication across cultures.
            </motion.p>
            
            <motion.p 
              className="text-muted-foreground leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              From Akan to Dagbani, Ga to Ewe, we combine deep cultural understanding with 
              cutting-edge technology to deliver language solutions that honor tradition while 
              embracing innovation. We serve government agencies, NGOs, cultural institutions, 
              and businesses committed to linguistic inclusivity.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="premium" size="lg" className="shadow-premium hover:shadow-glow" asChild>
                <Link to="/about">
                  Learn Our Story
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1, ease: [0.6, 0.05, 0.01, 0.9] }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-secondary/50 transition-all duration-500 hover:shadow-premium-lg overflow-hidden"
                >
                  {/* Gradient overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Animated corner accent */}
                  <motion.div 
                    className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  {/* Icon with glow */}
                  <motion.div
                    className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/5 mb-4 group-hover:shadow-glow transition-shadow duration-500"
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
                  
                  <motion.div 
                    className="relative font-display text-3xl lg:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-1"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="relative text-sm text-muted-foreground font-semibold">
                    {stat.label}
                  </div>
                  
                  {/* Bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
