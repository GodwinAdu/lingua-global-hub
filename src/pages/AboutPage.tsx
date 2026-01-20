import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Heart, Users, Lightbulb, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import aboutTeamImg from '@/assets/about-team.jpg';

const values = [
  {
    icon: Target,
    title: 'Excellence',
    description: 'We pursue the highest standards in every project, ensuring exceptional quality in all deliverables.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Honest, transparent relationships with our clients built on trust and professional ethics.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Working closely with clients to understand needs and deliver tailored solutions.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Embracing new technologies and methodologies to enhance our service delivery.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Deep love for languages and communication drives everything we do.',
  },
  {
    icon: Eye,
    title: 'Precision',
    description: 'Meticulous attention to detail ensures accuracy in every word and phrase.',
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(43_74%_49%_/_0.1)_0%,_transparent_50%)]" />
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4"
              >
                About Us
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Setting the Global Standard in Language Services
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-primary-foreground/70 leading-relaxed"
              >
                For over a decade, First Grade Lingua Consult has been the trusted partner 
                for organizations seeking exceptional language and media solutions.
              </motion.p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Story Section */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    First Grade Lingua Consult was founded with a singular vision: to bridge 
                    communication gaps and connect businesses with global audiences through 
                    the power of language.
                  </p>
                  <p>
                    What began as a small translation service has grown into a comprehensive 
                    language and media consultancy, serving multinational corporations, 
                    international organizations, government agencies, and NGOs across Africa 
                    and beyond.
                  </p>
                  <p>
                    Our team of certified linguists, interpreters, and media professionals 
                    brings together decades of combined experience and a shared passion for 
                    excellence. We don't just translate words—we convey meaning, culture, 
                    and intent with precision and authenticity.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-lg">
                  <img 
                    src={aboutTeamImg} 
                    alt="Our professional team"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Stats overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-8 -left-8 bg-card rounded-2xl p-6 shadow-premium-lg border border-border"
                >
                  <div className="text-4xl font-bold text-secondary mb-1">10+</div>
                  <div className="text-sm text-muted-foreground">Years of Excellence</div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-muted/30">
          <div className="container-premium">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="p-10 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Target className="w-7 h-7 text-secondary" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower organizations to communicate effectively across linguistic and 
                  cultural boundaries by providing world-class language and media services 
                  that set the standard for excellence in the industry.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="p-10 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <Eye className="w-7 h-7 text-accent" />
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be the most trusted and respected language consultancy in Africa and 
                  beyond, recognized for our commitment to quality, innovation, and the 
                  success of our clients on the global stage.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
                Our Values
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Principles That Guide Us
              </h2>
              <p className="text-lg text-muted-foreground">
                These core values shape every interaction and decision we make.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="group p-8 rounded-2xl bg-card border border-border hover:border-secondary/30 hover:shadow-premium-md transition-all duration-300"
                  >
                    <motion.div 
                      className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors duration-300"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Icon className="w-6 h-6 text-secondary" />
                    </motion.div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
