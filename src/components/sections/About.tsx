import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Globe2, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const stats = [
  { value: '500+', label: 'Projects Delivered', icon: Award },
  { value: '50+', label: 'Languages Covered', icon: Globe2 },
  { value: '100+', label: 'Corporate Clients', icon: Users },
  { value: '10+', label: 'Years Experience', icon: Clock },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
              About Us
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Setting the Standard in Language Excellence
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              First Grade Lingua Consult is a premier language and media consultancy 
              dedicated to bridging communication gaps across cultures and continents. 
              We combine linguistic expertise with cutting-edge technology to deliver 
              solutions that exceed expectations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our team of certified professionals brings decades of combined experience 
              in translation, interpretation, and media production. We serve multinational 
              corporations, international organizations, government agencies, and NGOs 
              with the same commitment to excellence.
            </p>
            <Button variant="premium" size="lg" asChild>
              <Link to="/about">
                Learn Our Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          {/* Right - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="group relative p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-premium-md"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-secondary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <Icon className="w-8 h-8 text-secondary mb-4" />
                  <div className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
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
