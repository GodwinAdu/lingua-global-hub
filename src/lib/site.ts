export const siteConfig = {
  name: 'First Grade Lingua Consult',
  shortName: 'First Grade Lingua',
  description:
    'World-class translation, interpretation, voice-over, and media production services for businesses and organizations worldwide.',
  tagline: 'Professional Language & Media Solutions for a Global Audience',
  twitter: '@FirstGradeLingua',
  email: 'firstlingualconsult@gmail.com',
};

/** Public base URL of the site, e.g. https://firstgradelingua.com (no trailing slash). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export function absoluteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
