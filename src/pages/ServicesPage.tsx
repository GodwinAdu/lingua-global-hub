import { motion } from 'framer-motion';
import { 
  Languages, 
  Mic2, 
  PlayCircle, 
  Music, 
  FileEdit, 
  PenTool,
  Check
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';

const services = [
  {
    id: 'translation',
    icon: Languages,
    title: 'Translation Services',
    description: 'Accurate, culturally-sensitive translations that preserve meaning and intent across 50+ languages.',
    features: [
      'Document translation (legal, medical, technical)',
      'Website and software localization',
      'Marketing and advertising translation',
      'Certified translation for official documents',
      'Post-editing of machine translation',
    ],
  },
  {
    id: 'interpretation',
    icon: Mic2,
    title: 'Interpretation Services',
    description: 'Professional interpretation for conferences, meetings, and events with seamless communication.',
    features: [
      'Simultaneous interpretation',
      'Consecutive interpretation',
      'Whispered interpretation',
      'Remote/virtual interpretation',
      'Liaison interpretation',
    ],
  },
  {
    id: 'voiceover',
    icon: PlayCircle,
    title: 'Voice-over Production',
    description: 'Studio-quality voice-over in multiple languages for all your audio and video content needs.',
    features: [
      'Commercial voice-over',
      'Documentary narration',
      'E-learning modules',
      'Corporate video narration',
      'Character voices for animation',
    ],
  },
  {
    id: 'jingle',
    icon: Music,
    title: 'Jingle Recording',
    description: 'Custom jingle creation and recording with professional vocalists and sound engineering.',
    features: [
      'Original jingle composition',
      'Jingle adaptation and translation',
      'Professional studio recording',
      'Multi-language versions',
      'Full production and mastering',
    ],
  },
  {
    id: 'editing',
    icon: FileEdit,
    title: 'Editing & Proofreading',
    description: 'Comprehensive editing services ensuring your content is polished, accurate, and impactful.',
    features: [
      'Copy editing',
      'Proofreading',
      'Content review',
      'Style consistency checks',
      'Quality assurance',
    ],
  },
  {
    id: 'scriptwriting',
    icon: PenTool,
    title: 'Script Writing',
    description: 'Creative and professional script development for all media formats and purposes.',
    features: [
      'Commercial scripts',
      'Corporate video scripts',
      'Documentary scripts',
      'Radio drama and podcast scripts',
      'Presentation scripts',
    ],
  },
];

const ServicesPage = () => {
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
              <span className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4">
                Our Services
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Comprehensive Language & Media Solutions
              </h1>
              <p className="text-xl text-primary-foreground/70 leading-relaxed">
                From translation to voice production, we provide end-to-end services 
                that help your message resonate across cultures and borders.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Services List */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <div className="space-y-20">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={service.id}
                    id={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className={`grid lg:grid-cols-2 gap-12 items-center ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    <div className={isEven ? '' : 'lg:order-2'}>
                      <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-secondary" />
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {service.title}
                      </h2>
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                              <Check className="w-3 h-3 text-secondary" />
                            </div>
                            <span className="text-foreground/80">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className={`${isEven ? 'lg:order-2' : ''}`}>
                      <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center border border-border">
                        <Icon className="w-24 h-24 text-secondary/20" />
                      </div>
                    </div>
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

export default ServicesPage;
