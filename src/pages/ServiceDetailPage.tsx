import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Languages, 
  Mic2, 
  PlayCircle, 
  Music, 
  FileEdit, 
  PenTool,
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  Clock,
  Award,
  Users
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';
import { Button } from '@/components/ui/button';

// Import service images
import translationImg from '@/assets/service-translation.jpg';
import interpretationImg from '@/assets/service-interpretation.jpg';
import voiceoverImg from '@/assets/service-voiceover.jpg';
import jingleImg from '@/assets/service-jingle.jpg';
import editingImg from '@/assets/service-editing.jpg';
import scriptwritingImg from '@/assets/service-scriptwriting.jpg';

const servicesData = {
  translation: {
    icon: Languages,
    title: 'Translation Services',
    subtitle: 'Breaking Language Barriers with Precision',
    description: 'Our translation services go beyond simple word-for-word conversion. We deliver culturally-adapted content that resonates with your target audience while maintaining the integrity of your original message.',
    image: translationImg,
    features: [
      'Document translation (legal, medical, technical)',
      'Website and software localization',
      'Marketing and advertising translation',
      'Certified translation for official documents',
      'Post-editing of machine translation',
      'Transcreation for creative content',
    ],
    stats: [
      { value: '50+', label: 'Languages', icon: Globe },
      { value: '99%', label: 'Accuracy Rate', icon: Award },
      { value: '24h', label: 'Turnaround', icon: Clock },
      { value: '200+', label: 'Translators', icon: Users },
    ],
    details: [
      {
        title: 'Industry Expertise',
        content: 'Our translators specialize in various industries including legal, medical, financial, technical, and marketing sectors. This specialization ensures accurate terminology and context-appropriate translations.',
      },
      {
        title: 'Quality Assurance',
        content: 'Every translation undergoes a rigorous three-step quality process: translation, editing, and proofreading (TEP). Our senior linguists review all deliverables to ensure consistency and accuracy.',
      },
      {
        title: 'Cultural Adaptation',
        content: 'We don\'t just translate words—we adapt your content for cultural relevance. Our localization experts ensure your message resonates with local audiences while maintaining brand consistency.',
      },
    ],
  },
  interpretation: {
    icon: Mic2,
    title: 'Interpretation Services',
    subtitle: 'Seamless Communication in Real-Time',
    description: 'Our professional interpreters facilitate clear communication in any setting, from high-stakes international conferences to intimate business meetings. We ensure every word is conveyed with precision and cultural sensitivity.',
    image: interpretationImg,
    features: [
      'Simultaneous interpretation',
      'Consecutive interpretation',
      'Whispered interpretation (chuchotage)',
      'Remote/virtual interpretation',
      'Liaison interpretation',
      'Court and legal interpretation',
    ],
    stats: [
      { value: '30+', label: 'Languages', icon: Globe },
      { value: '500+', label: 'Events Covered', icon: Award },
      { value: '100%', label: 'Reliability', icon: Clock },
      { value: '50+', label: 'Interpreters', icon: Users },
    ],
    details: [
      {
        title: 'Conference Interpretation',
        content: 'Our simultaneous interpreters are experienced in handling large-scale international conferences, summits, and multilateral meetings with multiple language requirements.',
      },
      {
        title: 'Business Meetings',
        content: 'For negotiations, board meetings, and corporate events, our consecutive and liaison interpreters ensure smooth communication between all parties.',
      },
      {
        title: 'Remote Interpretation',
        content: 'Our state-of-the-art remote interpretation platform enables seamless virtual meetings with professional interpreters, supporting your hybrid and online events.',
      },
    ],
  },
  voiceover: {
    icon: PlayCircle,
    title: 'Voice-over Production',
    subtitle: 'Bringing Your Content to Life',
    description: 'From commercials to documentaries, our voice-over services deliver studio-quality audio in any language. Our diverse talent pool ensures the perfect voice for your brand and audience.',
    image: voiceoverImg,
    features: [
      'Commercial voice-over',
      'Documentary narration',
      'E-learning and training modules',
      'Corporate video narration',
      'Character voices for animation',
      'IVR and phone system recordings',
    ],
    stats: [
      { value: '40+', label: 'Languages', icon: Globe },
      { value: '300+', label: 'Voice Artists', icon: Users },
      { value: '48h', label: 'Delivery', icon: Clock },
      { value: '1000+', label: 'Projects', icon: Award },
    ],
    details: [
      {
        title: 'Professional Studio',
        content: 'Our recording facilities feature industry-standard equipment and acoustically-treated studios, ensuring broadcast-quality audio for every project.',
      },
      {
        title: 'Diverse Talent Pool',
        content: 'Access our extensive roster of professional voice artists across ages, accents, and styles. We match the perfect voice to your brand personality and target audience.',
      },
      {
        title: 'Full Post-Production',
        content: 'Our audio engineers provide complete post-production services including editing, mixing, sound effects, and music integration for a polished final product.',
      },
    ],
  },
  jingle: {
    icon: Music,
    title: 'Jingle Recording',
    subtitle: 'Memorable Sounds for Your Brand',
    description: 'Create lasting impressions with custom jingles that capture your brand essence. Our composers and vocalists craft catchy, memorable audio that resonates with your audience.',
    image: jingleImg,
    features: [
      'Original jingle composition',
      'Jingle adaptation and translation',
      'Professional studio recording',
      'Multi-language versions',
      'Full production and mastering',
      'Radio and TV commercial music',
    ],
    stats: [
      { value: '20+', label: 'Languages', icon: Globe },
      { value: '100+', label: 'Jingles Created', icon: Music },
      { value: '50+', label: 'Vocalists', icon: Users },
      { value: '15+', label: 'Years Experience', icon: Award },
    ],
    details: [
      {
        title: 'Creative Composition',
        content: 'Our composers work closely with you to understand your brand, target audience, and campaign objectives, creating original music that perfectly represents your message.',
      },
      {
        title: 'Multi-Language Adaptation',
        content: 'We adapt jingles across multiple languages while maintaining the original melody, rhythm, and emotional impact—ensuring consistent brand presence across markets.',
      },
      {
        title: 'Professional Production',
        content: 'From initial concept to final master, our production team handles every aspect including arrangement, recording, mixing, and mastering to broadcast standards.',
      },
    ],
  },
  editing: {
    icon: FileEdit,
    title: 'Editing & Proofreading',
    subtitle: 'Polishing Your Content to Perfection',
    description: 'Ensure your written content is flawless with our comprehensive editing and proofreading services. Our expert editors refine your text for clarity, consistency, and impact.',
    image: editingImg,
    features: [
      'Copy editing',
      'Proofreading',
      'Substantive/developmental editing',
      'Style guide compliance',
      'Quality assurance review',
      'Consistency checking',
    ],
    stats: [
      { value: '99.9%', label: 'Error-Free', icon: Award },
      { value: '24h', label: 'Turnaround', icon: Clock },
      { value: '100+', label: 'Editors', icon: Users },
      { value: '50+', label: 'Industries', icon: Globe },
    ],
    details: [
      {
        title: 'Copy Editing',
        content: 'Our copy editors focus on grammar, spelling, punctuation, and syntax while ensuring your content flows naturally and adheres to your style guidelines.',
      },
      {
        title: 'Proofreading',
        content: 'The final quality check before publication, our proofreaders catch any remaining errors and ensure formatting consistency across your documents.',
      },
      {
        title: 'Style Compliance',
        content: 'Whether you follow AP, Chicago, or your own corporate style guide, our editors ensure consistent application throughout your content.',
      },
    ],
  },
  scriptwriting: {
    icon: PenTool,
    title: 'Script Writing',
    subtitle: 'Crafting Compelling Narratives',
    description: 'Transform your ideas into powerful scripts that captivate audiences. Our experienced writers create engaging content for any medium, from commercials to documentaries.',
    image: scriptwritingImg,
    features: [
      'Commercial and advertising scripts',
      'Corporate video scripts',
      'Documentary scripts',
      'Radio drama and podcast scripts',
      'Presentation scripts',
      'Training and e-learning scripts',
    ],
    stats: [
      { value: '500+', label: 'Scripts Written', icon: PenTool },
      { value: '50+', label: 'Writers', icon: Users },
      { value: '20+', label: 'Industries', icon: Globe },
      { value: '10+', label: 'Years Experience', icon: Award },
    ],
    details: [
      {
        title: 'Strategic Messaging',
        content: 'Our writers understand the art of persuasion. We craft scripts that align with your marketing objectives and effectively communicate your key messages.',
      },
      {
        title: 'Audience-Centric Approach',
        content: 'We research and understand your target audience to create scripts that resonate emotionally and drive the desired action.',
      },
      {
        title: 'Collaborative Process',
        content: 'From concept development to final revisions, we work closely with you at every stage to ensure the script perfectly captures your vision.',
      },
    ],
  },
};

const ServiceDetailPage = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = servicesData[serviceId as keyof typeof servicesData];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button asChild>
            <Link to="/services">Back to Services</Link>
          </Button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;
  const serviceKeys = Object.keys(servicesData);
  const currentIndex = serviceKeys.indexOf(serviceId || '');
  const prevService = currentIndex > 0 ? serviceKeys[currentIndex - 1] : null;
  const nextService = currentIndex < serviceKeys.length - 1 ? serviceKeys[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link 
                  to="/services" 
                  className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">All Services</span>
                </Link>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6"
              >
                <Icon className="w-8 h-8 text-secondary-foreground" />
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="inline-block text-sm font-semibold text-accent uppercase tracking-wider mb-4"
              >
                {service.subtitle}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                {service.title}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl text-primary-foreground/70 leading-relaxed"
              >
                {service.description}
              </motion.p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background -mt-10 relative z-10">
          <div className="container-premium">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {service.stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
                  >
                    <StatIcon className="w-8 h-8 text-secondary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
                  What We Offer
                </h2>
                <ul className="space-y-4">
                  {service.features.map((feature, index) => (
                    <motion.li
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check className="w-4 h-4 text-secondary" />
                      </div>
                      <span className="text-foreground/80 text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-premium-lg">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating accent */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-2xl bg-secondary/10 -z-10" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl md:text-4xl font-bold text-foreground mb-12 text-center"
            >
              How We Deliver Excellence
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {service.details.map((detail, index) => (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border hover:shadow-premium-md transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 text-secondary font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {detail.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {detail.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 bg-muted/30 border-t border-border">
          <div className="container-premium">
            <div className="flex justify-between items-center">
              {prevService ? (
                <Link 
                  to={`/services/${prevService}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <div>
                    <div className="text-xs uppercase tracking-wider">Previous</div>
                    <div className="font-semibold">{servicesData[prevService as keyof typeof servicesData].title}</div>
                  </div>
                </Link>
              ) : <div />}
              
              {nextService && (
                <Link 
                  to={`/services/${nextService}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-right"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wider">Next</div>
                    <div className="font-semibold">{servicesData[nextService as keyof typeof servicesData].title}</div>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
