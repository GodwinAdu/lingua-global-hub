export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images: string[];
  category: string;
  language: string;
  languageLabel: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
}

export const blogCategories = [
  { id: 'all', label: 'All', labelTwi: 'Nyinaa' },
  { id: 'news', label: 'News', labelTwi: 'Nsɛm' },
  { id: 'politics', label: 'Politics', labelTwi: 'Amammuo' },
  { id: 'education', label: 'Education', labelTwi: 'Adesua' },
  { id: 'culture', label: 'Culture', labelTwi: 'Amammrɛ' },
  { id: 'health', label: 'Health', labelTwi: 'Apɔmuden' },
  { id: 'sports', label: 'Sports', labelTwi: 'Agodie' },
];

export const blogLanguages = [
  { id: 'all', label: 'All Languages' },
  { id: 'twi', label: 'Twi' },
  { id: 'english', label: 'English' },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'sayerano-atutotoo-apolisifoo-baawotwe-de-won-adwuma-to-ho',
    title: 'Sayerano Atutotoɔ - Apolisifoɔ Baawɔtwe De Wɔn Adwuma To Hɔ',
    excerpt: 'Western North Polisi sadͻm no ama apolisifoͻ baawͻtwe de wͻn nnwuma atoto hͻ ansa (interdiction), ɛsiane Sayerano a ɛwɔ Juaboso Mansin mu atutotoͻ bi a ɛmaa nnipa baanu hweree wɔn nkwa na nnipa baasa nso pirapiraeɛ no nti.',
    content: `Western North Polisi sadͻm no ama apolisifoͻ baawͻtwe de wͻn nnwuma atoto hͻ ansa (interdiction), ɛsiane Sayerano a ɛwɔ Juaboso Mansin mu atutotoͻ bi a ɛmaa nnipa baanu hweree wɔn nkwa na nnipa baasa nso pirapiraeɛ no nti.

Krataa a Apolisifoɔ de too dwa Benada, Kitawonsa 7, 2026 mu no, wɔkyerɛɛ mu sɛ, mprempren yi, asomdwoeɛ asan aba Sayerano kurom hɔ, na wɔafi aseɛ reyɛ nhwehwɛmu fa asɛm no ho.

Saa atutotoͻ yi sii Kitawonsa 7, 2026 berɛ a Sayerano kuromafoͻ binom ne apolisifoͻ a na wɔrebͻ nsra 'patrol' hyiaeɛ maa akasakasa sii wɔn ntam.

Apolisifoɔ amanneɛbͻ no kyerɛ sɛ nnipa baasa piraa wɔ atutotoͻ no mu. Akyire yi, wɔn mu baanu wuwuiɛ, ɛnna nnipa afoforͻ baasa nso regye ayarehwɛ wɔ Asafo Roman Catholic Hospital.

Polisi sahene Panin Owura Christian Tetteh Yohuno ahyɛ Police Professional Standards Bureau (PPSB) a wͻhyɛ sɛ apolisifoͻ dwumadie bɛfa kwan pa soͻ no sɛ wɔnyɛ nhwehwɛmu a emu dɔ mfa atutotoͻ no farebae ho.

Krataa no toa so ka sɛ, nhwehwɛmu no rehyɛ aseɛ no, apolisifoɔ baawɔtwe a wͻn ho bͻn asɛm no mu no, wɔde wͻn nnwuma akonkͻn hͻ ansa.

Western North polisi sadͻm no toaa so maa ɔmanfoɔ awerɛhyem sɛ wɔbɛyɛ nhwehwɛmu a emu dɔ wɔ asɛm no ho, na deɛ ɛbɛfiri mu aba no, wɔbɛbɔ ɔmanfoɔ amanneɛ.`,
    coverImage: '/blog_image.jpeg',
    images: ['/blog_image.jpeg', '/police_logo.jpeg'],
    category: 'news',
    language: 'twi',
    languageLabel: 'Twi',
    author: {
      name: 'Stephen Ayettey',
      role: 'Kasadwumfo (Reporter)',
    },
    publishedAt: '2026-07-07',
    readingTime: '3 min',
    tags: ['Polisi', 'Sayerano', 'Western North', 'Juaboso'],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return [];
  return blogPosts
    .filter((post) => post.slug !== currentSlug && (post.category === current.category || post.language === current.language))
    .slice(0, limit);
}
