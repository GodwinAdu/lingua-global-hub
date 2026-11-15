import Image, { type ImageProps } from 'next/image';

// Hosts the image optimiser may fetch from (must match images.remotePatterns in next.config.ts).
const SUPABASE_HOST = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').host;
  } catch {
    return '';
  }
})();
const OPTIMISED_HOSTS = new Set([SUPABASE_HOST, 'images.unsplash.com'].filter(Boolean));

function canOptimise(src: string): boolean {
  if (/\.svg(\?|$)/i.test(src)) return false;
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  try {
    return OPTIMISED_HOSTS.has(new URL(src).host);
  } catch {
    return false;
  }
}

/**
 * next/image for site content. Images from this site and Supabase Storage are resized and served
 * as WebP/AVIF; links an editor pasted from elsewhere are shown as-is instead of breaking the page.
 */
export function SiteImage({ src, alt, ...props }: Omit<ImageProps, 'src'> & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={!canOptimise(src)} {...props} />;
}
