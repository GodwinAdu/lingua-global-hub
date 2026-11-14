// Shapes used by the public site. Server getters map database rows into these.

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Sanitized HTML. */
  content: string;
  coverImage: string;
  images: string[];
  /** Category slug, e.g. "news". */
  category: string;
  language: string;
  languageLabel: string;
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  readingTime: string;
  tags: string[];
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export interface BlogCategory {
  id: string; // slug, kept as `id` so existing filters keep working
  label: string;
  labelTwi: string;
}

export type TickerItem = { id: string; slug: string; title: string; languageLabel: string };

export const POST_LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'twi', label: 'Twi' },
] as const;

export const blogLanguages = [{ id: 'all', label: 'All Languages' }, ...POST_LANGUAGES];

export function languageLabel(id: string): string {
  return POST_LANGUAGES.find((l) => l.id === id)?.label ?? id;
}

/** Placeholder cover for posts without one. */
export const DEFAULT_COVER = '/placeholder.svg';
