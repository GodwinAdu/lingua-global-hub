import { getPublishedPosts } from '@/lib/content/posts';
import { htmlToText } from '@/lib/content/html';
import { absoluteUrl, siteConfig } from '@/lib/site';
import { usableShareImage } from '@/lib/seo/og';

const esc = (s: string) =>
  s.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

/** RSS 2.0 feed of the 50 latest posts: /feed.xml (news readers, Google News, aggregators). */
export async function GET() {
  const posts = (await getPublishedPosts()).slice(0, 50);
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      const image = usableShareImage(p.coverImage);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${esc(p.author.name)}</dc:creator>
      <description>${esc(p.excerpt || htmlToText(p.content).slice(0, 300))}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join('\n')}
${image ? `      <enclosure url="${esc(absoluteUrl(image))}" type="image/${/\.png$/i.test(image) ? 'png' : 'jpeg'}" length="0" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(siteConfig.name)}: Blog &amp; News</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${esc('News, culture, education and language articles in Twi and English.')}</description>
    <language>en-gh</language>
    ${posts[0] ? `<lastBuildDate>${new Date(posts[0].updatedAt || posts[0].publishedAt).toUTCString()}</lastBuildDate>` : ''}
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=900, s-maxage=3600' },
  });
}
