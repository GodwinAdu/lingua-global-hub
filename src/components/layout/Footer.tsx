'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Youtube, Music2 } from 'lucide-react';
import { useSiteSettings } from '@/components/layout/site-data';
import { telHref } from '@/lib/content/site-types';
import { motion } from 'framer-motion';

const footerLinks = {
  services: [
    { name: 'Translation', href: '/services#translation' },
    { name: 'Interpretation', href: '/services#interpretation' },
    { name: 'Voice-over', href: '/services#voiceover' },
    { name: 'Script Writing', href: '/services#scriptwriting' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Our Team', href: '/team' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Ebooks', href: '/ebooks' },
    { name: 'Contact', href: '/contact' },
    { name: 'Careers', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Staff Sign In', href: '/admin/login' },
  ],
};

export const Footer = () => {
  const settings = useSiteSettings();
  const socials = [
    { url: settings.linkedin_url, Icon: Linkedin, label: 'LinkedIn' },
    { url: settings.twitter_url, Icon: Twitter, label: 'X (Twitter)' },
    { url: settings.facebook_url, Icon: Facebook, label: 'Facebook' },
    { url: settings.instagram_url, Icon: Instagram, label: 'Instagram' },
    { url: settings.youtube_url, Icon: Youtube, label: 'YouTube' },
    { url: settings.tiktok_url, Icon: Music2, label: 'TikTok' },
  ].filter((s): s is typeof s & { url: string } => Boolean(s.url));
  const phones = [settings.phone_primary, settings.phone_secondary].filter(Boolean);

  // Read the clock after mount: a render-time `new Date()` would freeze at build time.
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      {/* Main Footer */}
      <div className="container-premium py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-glow">
                  <img src="/icon0.svg" alt="First Grade Lingua Consult" className="w-full h-full rounded-xl object-cover" />
                </div>
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-accent"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-xl leading-tight">
                  First Grade
                </span>
                <span className="text-xs text-primary-foreground/60 font-semibold tracking-[0.2em] uppercase">
                  Lingua Consult
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Professional language and media solutions for businesses, institutions, and organizations worldwide.
            </p>
            <div className="flex gap-3">
              {socials.map(({ url, Icon, label }, index) => (
                <motion.a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-accent">
              Services
            </h2>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-accent">
              Company
            </h2>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="font-display font-bold text-sm uppercase tracking-wider mb-6 text-accent">
              Contact
            </h2>
            <ul className="space-y-4">
              <motion.li 
                className="flex items-start gap-3 group"
                whileHover={{ x: 2 }}
              >
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm group-hover:text-primary-foreground/90 transition-colors">
                  {settings.address}
                </span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-3 group"
                whileHover={{ x: 2 }}
              >
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  {phones.map((phone) => (
                    <a
                      key={phone}
                      href={telHref(phone)}
                      className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </motion.li>
              <motion.li 
                className="flex items-center gap-3 group"
                whileHover={{ x: 2 }}
              >
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                >
                  {settings.email}
                </a>
              </motion.li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10 relative z-10">
        <div className="container-premium py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p 
            className="text-primary-foreground/50 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {year} First Grade Lingua Consult. All rights reserved.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.legal.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="text-primary-foreground/50 hover:text-primary-foreground/70 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
