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
            Our Process
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How We Work
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A streamlined, transparent process designed to deliver exceptional results every time.
          </p>
        </motion.div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="text-center">
                    {/* Step Number with Icon */}
                    <div className="relative inline-flex flex-col items-center mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-card border-2 border-border flex items-center justify-center mb-3 relative z-10 group hover:border-secondary transition-colors duration-300">
                        <Icon className="w-8 h-8 text-secondary" />
                      </div>
                      <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                        Step {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
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
