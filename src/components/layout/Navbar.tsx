import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Services', href: '/services' },
  { name: 'Team', href: '/team' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Contact', href: '/contact' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const location = useLocation();
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 50], [0.7, 0.95]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? 'py-2'
          : 'py-4'
      }`}
    >
      {/* Glassmorphism Background */}
      <motion.div
        style={{ opacity: navbarOpacity }}
        className={`absolute inset-0 transition-all duration-700 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-premium'
            : 'bg-primary/60 backdrop-blur-md border-b border-primary-foreground/10'
        }`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-accent/5 opacity-50" />
      </motion.div>

      <nav className="container-premium relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo with advanced animation */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary to-accent opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"
              />
              
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-premium group-hover:shadow-glow transition-all duration-500">
                <Globe className="w-6 h-6 text-primary-foreground" />
                
                {/* Rotating ring */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2 border-accent/30"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              {/* Sparkle badge */}
              <motion.div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-accent to-yellow-400 flex items-center justify-center shadow-gold"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="w-2 h-2 text-white" />
              </motion.div>
            </motion.div>
            
            <div className="flex flex-col">
              <motion.span 
                className={`font-display font-bold text-xl bg-gradient-to-r bg-clip-text leading-tight transition-colors duration-300 ${
                  isScrolled 
                    ? 'from-foreground to-foreground/80 text-transparent' 
                    : 'from-primary-foreground to-primary-foreground/90 text-transparent'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                First Grade
              </motion.span>
              <span className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                isScrolled ? 'text-muted-foreground' : 'text-primary-foreground/70'
              }`}>
                Lingua Consult
              </span>
            </div>
          </Link>

          {/* Desktop Navigation with advanced hover effects */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  onHoverStart={() => setHoveredLink(link.name)}
                  onHoverEnd={() => setHoveredLink(null)}
                >
                  <Link
                    to={link.href}
                    className="relative px-5 py-2.5 text-sm font-semibold transition-all duration-300 rounded-xl group"
                  >
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary/15 to-accent/10 shadow-md"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    <span className={`relative z-10 ${
                      isActive 
                        ? 'text-secondary' 
                        : isScrolled 
                          ? 'text-foreground/70 group-hover:text-foreground'
                          : 'text-primary-foreground/90 group-hover:text-primary-foreground'
                    }`}>
                      {link.name}
                    </span>
                    
                    {/* Bottom indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-secondary to-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                    
                    {/* Hover glow */}
                    {hoveredLink === link.name && !isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-br from-secondary/5 to-accent/5"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Button with shimmer effect */}
          <motion.div 
            className="hidden lg:flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="gold"
                size="lg" 
                className="relative overflow-hidden group shadow-gold hover:shadow-glow-lg"
                asChild
              >
                <Link to="/contact" className="relative z-10">
                  <span className="relative z-10">Request a Quote</span>
                  <motion.span
                    className="relative z-10"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.span>
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button with animation */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 relative z-10 ${
              isScrolled ? 'bg-muted/50' : 'bg-primary-foreground/10'
            }`}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className={`w-6 h-6 transition-colors duration-300 ${
                    isScrolled ? 'text-foreground' : 'text-primary-foreground'
                  }`} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className={`w-6 h-6 transition-colors duration-300 ${
                    isScrolled ? 'text-foreground' : 'text-primary-foreground'
                  }`} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu with advanced animations */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-xl z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-full left-0 right-0 mt-2 mx-4 lg:hidden  backdrop-blur-2xl border border-border/50 rounded-2xl shadow-premium-xl overflow-hidden z-50"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 pointer-events-none" />
              
              <div className="relative p-6 space-y-2">
                {navLinks.map((link, index) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                    >
                      <Link
                        to={link.href}
                        className={`block px-5 py-4 rounded-xl text-base font-semibold transition-all duration-300 relative overflow-hidden group ${
                          isActive
                            ? 'bg-gradient-to-br from-secondary/15 to-accent/10 text-secondary shadow-md'
                            : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        {/* Hover effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        
                        <span className="relative z-10 flex items-center justify-between">
                          {link.name}
                          {isActive && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="w-2 h-2 rounded-full bg-secondary"
                            />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Mobile CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 mt-4 border-t border-border/50"
                >
                  <Button 
                    variant="gold" 
                    size="lg" 
                    className="w-full relative overflow-hidden group shadow-gold"
                    asChild
                  >
                    <Link to="/contact">
                      <span className="relative z-10">Request a Quote</span>
                      <ArrowRight className="w-4 h-4 relative z-10" />
                      
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
