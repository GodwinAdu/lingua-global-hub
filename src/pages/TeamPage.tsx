import { motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, Linkedin, Mail, Award, Globe2, Languages } from 'lucide-react';

const team = [
  {
    name: 'Dr. Amara Okafor',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    bio: 'PhD in Linguistics with 15+ years in language services',
    specialties: ['Strategic Leadership', 'Business Development', 'Quality Assurance'],
  },
  {
    name: 'Michael Chen',
    role: 'Chief Operations Officer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    bio: 'MBA with expertise in international operations',
    specialties: ['Operations Management', 'Process Optimization', 'Team Leadership'],
  },
  {
    name: 'Sarah Williams',
    role: 'Head of Translation',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
    bio: 'Certified translator in 8 languages',
    specialties: ['Translation', 'Localization', 'Quality Control'],
  },
  {
    name: 'David Mensah',
    role: 'Lead Interpreter',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
    bio: 'UN-certified simultaneous interpreter',
    specialties: ['Simultaneous Interpretation', 'Conference Services', 'Training'],
  },
  {
    name: 'Fatima Hassan',
    role: 'Media Production Director',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    bio: 'Award-winning voice-over artist and producer',
    specialties: ['Voice-over', 'Audio Production', 'Script Writing'],
  },
  {
    name: 'James Okonkwo',
    role: 'Technology Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    bio: 'Expert in translation technology and AI',
    specialties: ['CAT Tools', 'AI Integration', 'Tech Innovation'],
  },
];

const stats = [
  { value: '50+', label: 'Team Members', icon: Users },
  { value: '30+', label: 'Languages', icon: Languages },
  { value: '15+', label: 'Countries', icon: Globe2 },
  { value: '20+', label: 'Certifications', icon: Award },
];

const TeamPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main >
        {/* Hero Section */}
         <section className="pt-32 pb-20 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,_hsl(43_74%_49%_/_0.1)_0%,_transparent_50%)]" />
          
          
          <div className="container-premium relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Meet Our{' '}
                <span className="gradient-text-gold">Expert Team</span>
              </h1>
              <p className="text-primary-foreground/70 text-lg md:text-xl leading-relaxed">
                A diverse group of language professionals, technologists, and creatives dedicated to breaking down communication barriers worldwide.
              </p>
            </motion.div>
          </div>
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-premium">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 mb-4">
                      <Icon className="w-7 h-7 text-secondary" />
                    </div>
                    <div className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground text-sm font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Grid */}
        <section className="py-24">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Leadership Team
              </h2>
              <p className="text-muted-foreground text-lg">
                Meet the experts driving our mission to deliver world-class language services
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-500 hover:shadow-premium-lg">
                    {/* Image */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                      
                      {/* Social Links */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.a
                          href="#"
                          className="w-10 h-10 rounded-lg bg-secondary/90 flex items-center justify-center hover:bg-secondary transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Linkedin className="w-5 h-5 text-white" />
                        </motion.a>
                        <motion.a
                          href="#"
                          className="w-10 h-10 rounded-lg bg-secondary/90 flex items-center justify-center hover:bg-secondary transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Mail className="w-5 h-5 text-white" />
                        </motion.a>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl font-bold text-foreground mb-1">
                        {member.name}
                      </h3>
                      <p className="text-secondary font-semibold text-sm mb-3">
                        {member.role}
                      </p>
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {member.bio}
                      </p>
                      
                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2">
                        {member.specialties.map((specialty) => (
                          <span
                            key={specialty}
                            className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="container-premium">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Join Our Team
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                We're always looking for talented linguists, interpreters, and media professionals to join our growing team.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-secondary to-secondary/90 text-white font-semibold hover:shadow-glow transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Open Positions
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TeamPage;
