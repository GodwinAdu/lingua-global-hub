// Fixed public pages that have editable SEO (dashboard: Website > SEO). Shared by site and dashboard.

export const SEO_PAGE_KEYS = ['home', 'about', 'services', 'team', 'portfolio', 'blog', 'ebooks', 'contact'] as const;
export type SeoPageKey = (typeof SEO_PAGE_KEYS)[number];

export const SEO_PAGES: Record<SeoPageKey, { name: string; path: string; title: string; description: string }> = {
  home: {
    name: 'Home',
    path: '/',
    title: 'Translation, Interpretation & Voice-over Services in Ghana',
    description:
      'First Grade Lingua Consult, Accra: professional translation, interpretation, voice-over and media production in Twi, Ga, Ewe, Dagbani, English and 50+ languages.',
  },
  about: {
    name: 'About',
    path: '/about',
    title: 'About Us | Ghana Language & Media Consultancy',
    description:
      "Learn about First Grade Lingua Consult, Ghana's language and media consultancy in Danfa, Accra: our mission, values and team.",
  },
  services: {
    name: 'Services',
    path: '/services',
    title: 'Language Services in Ghana: Translation, Interpretation, Voice-over',
    description:
      'Document translation, conference interpretation, voice-over, jingle recording, editing, proofreading and script writing in Ghanaian and international languages.',
  },
  team: {
    name: 'Team',
    path: '/team',
    title: 'Our Team of Translators, Interpreters & Voice Artists',
    description: 'Meet the native-speaker linguists, interpreters, voice artists and writers behind First Grade Lingua Consult in Accra.',
  },
  portfolio: {
    name: 'Portfolio',
    path: '/portfolio',
    title: 'Portfolio: Translation & Media Projects',
    description: 'Selected translation, interpretation and media production projects for government, NGOs, media houses and businesses in Ghana.',
  },
  blog: {
    name: 'Blog & News',
    path: '/blog',
    title: 'Blog & News in Twi and English',
    description: 'News, culture, education and language articles in Twi and English from First Grade Lingua Consult.',
  },
  ebooks: {
    name: 'Ebooks',
    path: '/ebooks',
    title: 'Ebooks on Ghanaian Languages & Culture',
    description: 'Free and paid ebooks from First Grade Lingua Consult in English and Ghanaian languages. Download instantly, no account needed.',
  },
  contact: {
    name: 'Contact',
    path: '/contact',
    title: 'Contact Us: Get a Free Translation Quote',
    description:
      'Contact First Grade Lingua Consult in Danfa, Accra for a free quote on translation, interpretation, voice-over and media services. Call, WhatsApp or email us.',
  },
};

export const SEO_LIMITS = { title: 70, description: 170 } as const;
