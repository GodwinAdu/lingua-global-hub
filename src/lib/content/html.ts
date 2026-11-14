import sanitize from 'sanitize-html';

/**
 * Allow-list for article HTML produced by the editor. Runs on the server before
 * every save, so anything the browser sends (including hand-crafted requests)
 * is reduced to these tags and attributes. Scripts, styles, iframes and event
 * handlers are always stripped.
 */
const OPTIONS: sanitize.IOptions = {
  allowedTags: [
    'p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 's',
    'blockquote', 'ul', 'ol', 'li', 'a', 'img', 'hr', 'code', 'pre',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https', 'http'] },
  allowProtocolRelative: false,
  transformTags: {
    // External links open safely in a new tab.
    a: (tagName, attribs) => {
      const external = /^https?:\/\//i.test(attribs.href ?? '');
      return {
        tagName,
        attribs: external ? { ...attribs, target: '_blank', rel: 'noopener noreferrer nofollow' } : attribs,
      };
    },
  },
};

export function sanitizeArticleHtml(html: string): string {
  return sanitize(html, OPTIONS).trim();
}

export function htmlToText(html: string): string {
  return sanitize(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function readingMinutes(html: string): number {
  const words = htmlToText(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Plain paragraphs (blank-line separated) to HTML, for legacy text content. */
export function textToHtml(text: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escape(p)}</p>`)
    .join('');
}

/** URL slug: lowercase ASCII letters, digits and hyphens. Twi letters are transliterated. */
export function slugify(input: string): string {
  return input
    .replace(/[ɛƐ]/g, 'e')
    .replace(/[ɔƆͻ]/g, 'o')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
    .replace(/-+$/g, '');
}
