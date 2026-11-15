import { absoluteUrl, siteConfig } from '@/lib/site';
import type { SiteSettings } from '@/lib/content/site-types';

type Json = Record<string, unknown>;

export const ORG_ID = absoluteUrl('/#organization');
export const WEBSITE_ID = absoluteUrl('/#website');

const DAYS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
const ORDER = Object.keys(DAYS);

/** "9AM", "9:30 pm", "18:00" -> "09:00" / "21:30" / "18:00". */
function to24h(t: string): string | null {
  const m = t.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) return null;
  let h = Number(m[1]);
  const min = m[2] ?? '00';
  if (m[3] === 'pm' && h < 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  if (h > 23) return null;
  return `${String(h).padStart(2, '0')}:${min}`;
}

/**
 * Turns lines like "Monday - Friday: 9AM - 6PM" or "Saturday: 10AM - 2PM" into
 * schema.org OpeningHoursSpecification. Lines it can't read are skipped.
 */
export function parseOpeningHours(lines: string[]): Json[] {
  const out: Json[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*([A-Za-z]+)(?:\s*[-–to]+\s*([A-Za-z]+))?\s*:\s*([\d:]+\s*[ap]?m?)\s*[-–to]+\s*([\d:]+\s*[ap]?m?)\s*$/i);
    if (!m) continue;
    const start = ORDER.indexOf(m[1].slice(0, 3).toLowerCase());
    const end = m[2] ? ORDER.indexOf(m[2].slice(0, 3).toLowerCase()) : start;
    const opens = to24h(m[3]);
    const closes = to24h(m[4]);
    if (start < 0 || end < start || !opens || !closes) continue;
    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ORDER.slice(start, end + 1).map((d) => DAYS[d]),
      opens,
      closes,
    });
  }
  return out;
}

/** The business: LocalBusiness (Accra office) and Organization in one node, built from Site settings. */
export function organizationJsonLd(s: SiteSettings, services: string[] = []): Json {
  const sameAs = [s.facebook_url, s.twitter_url, s.linkedin_url, s.instagram_url, s.youtube_url, s.tiktok_url].filter(Boolean);
  const phones = [s.phone_primary, s.phone_secondary].filter(Boolean);
  const hours = parseOpeningHours(s.working_hours ?? []);
  return {
    '@type': ['ProfessionalService', 'Organization'],
    '@id': ORG_ID,
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/apple-icon.png'),
    image: absoluteUrl('/og'),
    description: s.business_description || siteConfig.description,
    ...(s.email && { email: s.email }),
    ...(phones[0] && { telephone: phones[0] }),
    ...(phones.length && {
      contactPoint: phones.map((telephone) => ({
        '@type': 'ContactPoint',
        telephone,
        contactType: 'customer service',
        areaServed: 'GH',
        availableLanguage: ['English', 'Twi', 'Ga', 'Ewe', 'Dagbani', 'French'],
      })),
    }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address || 'HNO. BE 37, Dandellon Street',
      addressLocality: 'Danfa, Accra',
      addressRegion: 'Greater Accra',
      addressCountry: 'GH',
      ...(s.digital_address && { postalCode: s.digital_address }),
    },
    ...(s.map_lat != null && s.map_lng != null && { geo: { '@type': 'GeoCoordinates', latitude: s.map_lat, longitude: s.map_lng } }),
    ...(hours.length && { openingHoursSpecification: hours }),
    ...(s.founded_year && { foundingDate: String(s.founded_year) }),
    areaServed: [{ '@type': 'Country', name: 'Ghana' }, { '@type': 'Place', name: 'West Africa' }],
    knowsLanguage: ['en', 'tw', 'ak', 'gaa', 'ee', 'dag', 'ha', 'fr', 'ar'],
    ...(services.length && {
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Language services',
        itemListElement: services.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    }),
    ...(sameAs.length && { sameAs }),
  };
}

export function websiteJsonLd(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: absoluteUrl('/'),
    name: siteConfig.name,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

/** Breadcrumbs: Home > ... > current. Each item is [name, path]. */
export function breadcrumbJsonLd(items: [string, string][]): Json {
  const all: [string, string][] = [['Home', '/'], ...items];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: all.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: absoluteUrl(path) })),
  };
}

/** Wraps nodes in one @graph document. */
export function graph(...nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
