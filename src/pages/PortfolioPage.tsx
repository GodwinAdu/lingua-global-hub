import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CTA from '@/components/sections/CTA';

const categories = ['All', 'Translation', 'Voice-over', 'Interpretation', 'Media Production'];

const projects = [
  {
    title: 'Annual Report Translation',
    category: 'Translation',
    client: 'Global Development Bank',
    description: 'Comprehensive translation of annual reports into 12 African languages.',
  },
  {
    title: 'E-Learning Narration',
    category: 'Voice-over',
    client: 'EdTech Africa',
    description: 'Multi-language voice-over for educational platform reaching 5M students.',
  },
  {
    title: 'International Summit',
    category: 'Interpretation',
    client: 'African Union',
    description: 'Simultaneous interpretation services for heads of state summit.',
  },
  {
    title: 'Brand Campaign Localization',
    category: 'Translation',
    client: 'Multinational FMCG',
    description: 'Full campaign localization across 8 West African markets.',
  },
  {
    title: 'Documentary Series',
    category: 'Media Production',
    client: 'National Broadcasting',
    description: 'Complete audio production for 10-part documentary series.',
  },
  {
    title: 'Medical Conference',
    category: 'Interpretation',
    client: 'WHO Regional Office',
    description: 'Technical interpretation for healthcare professionals summit.',
  },
  {
    title: 'Radio Commercial Campaign',
    category: 'Voice-over',
    client: 'Telecom Provider',
    description: 'Regional radio campaign with voice-over in 15 local languages.',
  },
  {
    title: 'Corporate Video Series',
    category: 'Media Production',
    client: 'Energy Corporation',
    description: 'Script writing and production for investor communications.',
  },
];

const PortfolioPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

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
                Our Work
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Featured Projects
              </h1>
              <p className="text-xl text-primary-foreground/70 leading-relaxed">
                Explore our portfolio of successful projects delivered for leading 
                organizations across Africa and beyond.
              </p>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Portfolio Grid */}
        <section className="py-24 bg-background">
          <div className="container-premium">
            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-wrap gap-3 justify-center mb-12"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-secondary text-secondary-foreground shadow-glow'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-card border border-border hover:border-secondary/30 transition-all duration-300 hover:shadow-premium-lg">
                    {/* Project Image Placeholder */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold text-secondary/10">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <span className="inline-block text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                        {project.category}
                      </span>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {project.client}
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
