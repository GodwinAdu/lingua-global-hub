import { Link } from 'react-router-dom';
import { Globe, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'Translation', href: '/services#translation' },
    { name: 'Interpretation', href: '/services#interpretation' },
    { name: 'Voice-over', href: '/services#voiceover' },
    { name: 'Script Writing', href: '/services#scriptwriting' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-premium py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Globe className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  First Grade
                </span>
                <span className="text-xs text-primary-foreground/60 font-medium tracking-wider uppercase">
                  Lingua Consult
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Professional language and media solutions for businesses, institutions, and organizations worldwide.
            </p>
            <div className="flex gap-3">
              {[Linkedin, Twitter, Facebook].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-colors duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6 text-accent">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6 text-accent">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-6 text-accent">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  123 Business District, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="tel:+2341234567890"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href="mailto:info@firstgradelingua.com"
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  info@firstgradelingua.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-premium py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} First Grade Lingua Consult. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-primary-foreground/50 hover:text-primary-foreground/70 text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
