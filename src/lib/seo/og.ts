/** URL of the generated branded share image (src/app/og/route.tsx). Relative; metadataBase makes it absolute. */
export function ogImage(title: string, kicker?: string): string {
  const q = new URLSearchParams({ title: title.slice(0, 110) });
  if (kicker) q.set('kicker', kicker.slice(0, 40));
  return `/og?${q.toString()}`;
}

/** Social sites can't use SVG previews; treat those (e.g. the placeholder cover) as "no image". */
export function usableShareImage(url: string | null | undefined): string | null {
  if (!url || /\.svg(\?|$)/i.test(url)) return null;
  return url;
}

const BRAND = ' | First Grade Lingua Consult';
const MAX_TITLE = 65;

/**
 * Page title for metadata. Short titles get the brand suffix (via the root title template);
 * long ones are used as-is so Google doesn't cut off the important words.
 */
export function seoTitle(title: string): string | { absolute: string } {
  return title.length + BRAND.length > MAX_TITLE ? { absolute: title } : title;
}

/** The title exactly as it will appear in search results (for the dashboard preview). */
export function shownTitle(title: string): string {
  return title.length + BRAND.length > MAX_TITLE ? title : `${title}${BRAND}`;
}

/** Meta description: at most ~160 characters, cut at a word boundary. */
export function seoDescription(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max - 30)).replace(/[,.;:\-–\s]+$/, '')}…`;
}

/** Canonical URL plus the RSS feed link (pages that set `alternates` replace the root one). */
export function alternates(path: string) {
  return { canonical: path, types: { 'application/rss+xml': [{ url: '/feed.xml', title: 'First Grade Lingua Consult: Blog & News' }] } };
}
