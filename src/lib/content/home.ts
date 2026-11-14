// Home page sections: defaults (the original site text), dashboard field definitions,
// and the shape of list items. Shared by the public site and the dashboard.

export const HOME_SECTION_KEYS = [
  'hero', 'stats', 'marquee', 'ghana_languages', 'about', 'services',
  'features', 'trust', 'why', 'process', 'testimonials', 'cta',
] as const;
export type HomeSectionKey = (typeof HOME_SECTION_KEYS)[number];

export type HomeItem = {
  id: number;
  title: string;
  description: string;
  value: string;
  icon: string;
  items: string[];
};

export type HomeSection = { visible: boolean; content: Record<string, string>; items: HomeItem[] };
export type HomePage = Record<HomeSectionKey, HomeSection>;

export type HomeField = {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'image' | 'lines';
  hint?: string;
  maxLength?: number;
};

export type HomeItemField = {
  name: 'title' | 'description' | 'value' | 'icon' | 'items';
  label: string;
  type?: 'text' | 'textarea' | 'icon' | 'lines';
  placeholder?: string;
  hint?: string;
  maxLength?: number;
  required?: boolean;
};

type SectionDef = {
  key: HomeSectionKey;
  name: string;
  description: string;
  fields: HomeField[];
  items?: { label: string; fields: HomeItemField[]; summary: (i: HomeItem) => string };
  /** Managed on another dashboard page. */
  managedAt?: { label: string; href: string };
};

const heading = (eyebrow = true): HomeField[] => [
  ...(eyebrow ? [{ name: 'eyebrow', label: 'Small label above the heading', maxLength: 80 }] : []),
  { name: 'title', label: 'Heading', maxLength: 160 },
  { name: 'highlight', label: 'Highlighted end of the heading', hint: 'Shown in the accent colour after the heading.', maxLength: 80 },
  { name: 'intro', label: 'Intro text', type: 'textarea', maxLength: 600 },
];

const titleDesc = (titleLabel = 'Title', descLabel = 'Description'): HomeItemField[] => [
  { name: 'title', label: titleLabel, required: true, maxLength: 160 },
  { name: 'description', label: descLabel, type: 'textarea', maxLength: 600 },
  { name: 'icon', label: 'Icon', type: 'icon' },
];

export const HOME_SECTIONS: SectionDef[] = [
  {
    key: 'hero',
    name: 'Hero (top of the page)',
    description: 'The big headline, buttons and background image.',
    fields: [
      { name: 'badge', label: 'Badge above the headline', maxLength: 80 },
      { name: 'title_line1', label: 'Headline line 1', maxLength: 80 },
      { name: 'title_line2', label: 'Headline line 2', maxLength: 80 },
      { name: 'highlight', label: 'Highlighted end of the headline', maxLength: 60 },
      { name: 'subtitle', label: 'Text under the headline', type: 'textarea', maxLength: 600 },
      { name: 'primary_label', label: 'Main button text', maxLength: 40 },
      { name: 'primary_href', label: 'Main button link', hint: 'A page on this site, e.g. /contact', maxLength: 200 },
      { name: 'secondary_label', label: 'Second button text', maxLength: 40 },
      { name: 'secondary_href', label: 'Second button link', hint: 'e.g. /services', maxLength: 200 },
      { name: 'trusted_label', label: '"Trusted by" label', maxLength: 80 },
      { name: 'trusted', label: '"Trusted by" names', type: 'lines', hint: 'One per line.' },
      { name: 'image_url', label: 'Background image', type: 'image' },
    ],
  },
  {
    key: 'stats',
    name: 'Numbers band',
    description: 'Animated counters under the hero.',
    fields: [],
    items: {
      label: 'Number',
      fields: [
        { name: 'value', label: 'Number', placeholder: 'e.g. 500+', hint: 'Digits count up when shown; anything after them (like +) stays.', required: true, maxLength: 20 },
        { name: 'title', label: 'Label', placeholder: 'e.g. Projects Completed', required: true, maxLength: 60 },
        { name: 'icon', label: 'Icon', type: 'icon' },
      ],
      summary: (i) => `${i.value} ${i.title}`,
    },
  },
  {
    key: 'marquee',
    name: 'Scrolling languages',
    description: 'The row of language names that scrolls across the page.',
    fields: [{ name: 'label', label: 'Label above the row', maxLength: 120 }],
    items: {
      label: 'Language',
      fields: [{ name: 'title', label: 'Language', required: true, maxLength: 60 }],
      summary: (i) => i.title,
    },
  },
  {
    key: 'ghana_languages',
    name: "Ghana's languages",
    description: 'Language families with their languages and number of speakers.',
    fields: [
      { name: 'eyebrow', label: 'Small label above the heading', maxLength: 80 },
      { name: 'title', label: 'Heading', maxLength: 160 },
      { name: 'intro', label: 'Intro text', type: 'textarea', maxLength: 600 },
      { name: 'extra_title', label: 'Bottom note (bold start)', maxLength: 120 },
      { name: 'extra_text', label: 'Bottom note (rest)', type: 'textarea', maxLength: 600 },
    ],
    items: {
      label: 'Language family',
      fields: [
        { name: 'title', label: 'Family name', placeholder: 'e.g. Akan Languages', required: true, maxLength: 80 },
        { name: 'items', label: 'Languages', type: 'lines', hint: 'One per line.' },
        { name: 'value', label: 'Speakers', placeholder: 'e.g. 9+ million', maxLength: 40 },
        { name: 'icon', label: 'Icon', type: 'icon' },
      ],
      summary: (i) => `${i.title} · ${i.items.length} languages`,
    },
  },
  {
    key: 'about',
    name: 'About',
    description: 'Introduction to the company with key numbers.',
    fields: [
      { name: 'eyebrow', label: 'Small label above the heading', maxLength: 80 },
      { name: 'title', label: 'Heading', maxLength: 160 },
      { name: 'highlight', label: 'Highlighted end of the heading', maxLength: 80 },
      { name: 'paragraph1', label: 'First paragraph', type: 'textarea', maxLength: 800 },
      { name: 'paragraph2', label: 'Second paragraph', type: 'textarea', maxLength: 800 },
      { name: 'button_label', label: 'Button text', maxLength: 40 },
    ],
    items: {
      label: 'Number',
      fields: [
        { name: 'value', label: 'Number', placeholder: 'e.g. 50+', required: true, maxLength: 20 },
        { name: 'title', label: 'Label', required: true, maxLength: 60 },
        { name: 'icon', label: 'Icon', type: 'icon' },
      ],
      summary: (i) => `${i.value} ${i.title}`,
    },
  },
  {
    key: 'services',
    name: 'Services',
    description: 'Heading above the service cards.',
    fields: [
      { name: 'eyebrow', label: 'Small label above the heading', maxLength: 80 },
      { name: 'title', label: 'Heading', maxLength: 160 },
      { name: 'intro', label: 'Intro text', type: 'textarea', maxLength: 600 },
      { name: 'button_label', label: 'Button text', maxLength: 40 },
    ],
    managedAt: { label: 'Edit the service cards', href: '/admin/services' },
  },
  {
    key: 'features',
    name: 'Features',
    description: 'Feature cards ("Built for Excellence").',
    fields: [...heading(), { name: 'button_label', label: 'Button text', maxLength: 40 }],
    items: { label: 'Feature', fields: titleDesc(), summary: (i) => i.title },
  },
  {
    key: 'trust',
    name: 'Trust badges',
    description: 'Certifications and memberships.',
    fields: [{ name: 'eyebrow', label: 'Label above the badges', maxLength: 80 }],
    items: { label: 'Badge', fields: titleDesc('Title', 'Subtitle'), summary: (i) => `${i.title} · ${i.description}` },
  },
  {
    key: 'why',
    name: 'Why choose us',
    description: 'Reasons to choose First Grade Lingua Consult.',
    fields: heading(),
    items: { label: 'Reason', fields: titleDesc(), summary: (i) => i.title },
  },
  {
    key: 'process',
    name: 'How we work',
    description: 'Step-by-step process. Steps are numbered in the order shown.',
    fields: heading(),
    items: { label: 'Step', fields: titleDesc('Step title'), summary: (i) => i.title },
  },
  {
    key: 'testimonials',
    name: 'Testimonials',
    description: 'Heading above the client quotes.',
    fields: heading(),
    managedAt: { label: 'Edit the quotes', href: '/admin/testimonials' },
  },
  {
    key: 'cta',
    name: 'Call to action',
    description: 'The closing band with the quote and WhatsApp buttons.',
    fields: [
      { name: 'title', label: 'Heading', maxLength: 160 },
      { name: 'highlight', label: 'Highlighted part of the heading', maxLength: 80 },
      { name: 'suffix', label: 'After the highlight', hint: 'e.g. ?', maxLength: 10 },
      { name: 'text', label: 'Text', type: 'textarea', maxLength: 600 },
      { name: 'primary_label', label: 'Main button text', maxLength: 40 },
      { name: 'whatsapp_label', label: 'WhatsApp button text', maxLength: 40 },
    ],
  },
];

export const HOME_DEFAULTS: Record<HomeSectionKey, Record<string, string>> = {
  hero: {
    badge: "Ghana's Premier Language Consultancy",
    title_line1: 'Professional Language',
    title_line2: '& Media Solutions for',
    highlight: 'Ghana & Beyond',
    subtitle:
      "Specializing in Ghana's diverse languages including Akan, Ga, Ewe, Dagbani, and 50+ more. We deliver exceptional translation, interpretation, voice-over, and media production services to preserve and promote linguistic heritage across Ghana and Africa.",
    primary_label: 'Request a Quote',
    primary_href: '/contact',
    secondary_label: 'Explore Our Services',
    secondary_href: '/services',
    trusted_label: 'Trusted by Industry Leaders',
    trusted: 'Ghana Gov Agencies\nNGOs\nCultural Institutions\nMedia Houses\nCorporate Clients',
    image_url: '/images/hero-bg.jpg',
  },
  stats: {},
  marquee: { label: "Ghana's Languages & Beyond - We Speak Your Language" },
  ghana_languages: {
    eyebrow: "Ghana's Linguistic Diversity",
    title: '50+ Languages, One Mission',
    intro:
      'We specialize in documenting and translating across all major Ghanaian language families, preserving the rich linguistic heritage of our nation.',
    extra_title: 'Plus 40+ additional languages',
    extra_text:
      "including Nzema, Ahanta, Sefwi, Buli, Konkomba, Nawuri, and many more indigenous languages across Ghana's diverse regions. We also provide services in major international languages including English, French, Arabic, Portuguese, and Spanish.",
  },
  about: {
    eyebrow: 'About Us',
    title: "Preserving Ghana's",
    highlight: 'Linguistic Heritage',
    paragraph1:
      "First Grade Lingua Consult is Ghana's premier language and media consultancy, dedicated to documenting, preserving, and promoting the rich linguistic diversity of Ghana's 50+ indigenous languages while bridging communication across cultures.",
    paragraph2:
      'From Akan to Dagbani, Ga to Ewe, we combine deep cultural understanding with cutting-edge technology to deliver language solutions that honor tradition while embracing innovation. We serve government agencies, NGOs, cultural institutions, and businesses committed to linguistic inclusivity.',
    button_label: 'Learn Our Story',
  },
  services: {
    eyebrow: 'Our Services',
    title: 'Comprehensive Language Documentation & Media Solutions',
    intro:
      "From translation to voice production in Ghana's diverse languages, we provide end-to-end services that help preserve linguistic heritage and ensure your message resonates across cultures.",
    button_label: 'View All Services',
  },
  features: {
    eyebrow: "Why We're Different",
    title: 'Built for',
    highlight: 'Excellence',
    intro: 'Every detail designed to deliver exceptional results',
    button_label: 'Discover More About Us',
  },
  trust: { eyebrow: 'Trusted & Certified' },
  why: {
    eyebrow: 'Why Choose Us',
    title: 'The First Grade',
    highlight: 'Advantage',
    intro:
      "Experience Ghana's premier language consultancy. We combine linguistic expertise with deep cultural knowledge to preserve and promote our nation's linguistic heritage.",
  },
  process: {
    eyebrow: 'Our Process',
    title: 'How We',
    highlight: 'Work',
    intro: 'A streamlined, transparent process designed to deliver exceptional results every time.',
  },
  testimonials: {
    eyebrow: 'Testimonials',
    title: 'What Our Clients',
    highlight: 'Say',
    intro: 'Hear from organizations across Ghana who trust us with their language needs.',
  },
  cta: {
    title: "Ready to Preserve Ghana's",
    highlight: 'Linguistic Heritage',
    suffix: '?',
    text: "Let's discuss how we can help document, translate, and promote Ghana's diverse languages. Get a free consultation and quote today.",
    primary_label: 'Request a Quote',
    whatsapp_label: 'Chat on WhatsApp',
  },
};

/** Lines field ("a\nb") to a list. */
export const lines = (v: string | undefined) => (v ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

/** Split "500+" into 500 and "+" for the animated counter. */
export function parseCount(value: string): { number: number | null; prefix: string; suffix: string } {
  const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!m) return { number: null, prefix: '', suffix: value };
  return { number: Number(m[2].replace(/,/g, '')), prefix: m[1], suffix: m[3] };
}
