import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, FileSearch, Settings, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Consultation',
    description: 'We begin with a detailed discussion to understand your project requirements, goals, and timeline.',
  },
  {
    number: '02',
    icon: FileSearch,
    title: 'Analysis & Quote',
    description: 'Our experts analyze your materials and provide a comprehensive quote with transparent pricing.',
  },
  {
    number: '03',
    icon: Settings,
    title: 'Production',
    description: 'Our skilled team executes the project with precision, maintaining constant quality control.',
  },
  {
    number: '04',
    icon: CheckCircle,
    title: 'Delivery & Review',
    description: 'We deliver on time and work with you to ensure complete satisfaction with the final product.',
  },
];

export const Process = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-background overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
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
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary uppercase tracking-wider mb-4 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-secondary"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Our Process
          </motion.span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How We{' '}
            <span className="gradient-text">Work</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A streamlined, transparent process designed to deliver exceptional results every time.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Animated Connecting Line */}
          <motion.div 
            className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: [0.6, 0.05, 0.01, 0.9] }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  <div className="text-center">
                    {/* Step Number with Icon */}
                    <div className="relative inline-flex flex-col items-center mb-6">
                      <motion.div 
                        className="relative w-20 h-20 rounded-2xl bg-card border-2 border-border flex items-center justify-center mb-3 z-10 group hover:border-secondary transition-all duration-500 overflow-hidden"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {/* Gradient overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        <Icon className="w-8 h-8 text-secondary relative z-10" />
                        
                        {/* Rotating ring */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2 border-secondary/20"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                      
                      <motion.span 
                        className="text-xs font-bold text-secondary uppercase tracking-widest"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: index * 0.15 + 0.3 }}
                      >
                        Step {step.number}
                      </motion.span>
                    </div>

                    {/* Content */}
                    <motion.h3 
                      className="font-display text-xl font-semibold text-foreground mb-3"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: index * 0.15 + 0.4 }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p 
                      className="text-muted-foreground leading-relaxed text-sm"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: index * 0.15 + 0.5 }}
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
