import { ImageResponse } from 'next/og';

/**
 * Branded 1200x630 share image: /og?title=...&kicker=...
 * Used for WhatsApp/Facebook/LinkedIn/X previews wherever a page has no image of its own.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const clean = (v: string | null, max: number) => (v ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  const title = clean(searchParams.get('title'), 110) || 'Professional Language & Media Solutions for Ghana & Beyond';
  const kicker = clean(searchParams.get('kicker'), 40) || 'First Grade Lingua Consult';

  const logo = await fetch(new URL('/apple-icon.png', origin))
    .then(async (r) => (r.ok ? `data:image/png;base64,${Buffer.from(await r.arrayBuffer()).toString('base64')}` : null))
    .catch(() => null);

  const size = title.length > 70 ? 54 : title.length > 40 ? 64 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #050d1c 0%, #0b1d3d 55%, #12306b 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={76} height={76} style={{ borderRadius: 16 }} alt="" />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 30, fontWeight: 700 }}>First Grade</div>
            <div style={{ fontSize: 18, letterSpacing: 6, color: '#9fb3d9' }}>LINGUA CONSULT</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div style={{ display: 'flex', fontSize: 24, fontWeight: 600, color: '#f5b52e', textTransform: 'uppercase', letterSpacing: 3 }}>
            {kicker}
          </div>
          <div style={{ display: 'flex', fontSize: size, fontWeight: 800, lineHeight: 1.12, maxWidth: 1050 }}>{title}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, color: '#9fb3d9' }}>
          <div style={{ display: 'flex' }}>Translation · Interpretation · Voice-over · Media</div>
          <div style={{ display: 'flex', width: 140, height: 8, borderRadius: 4, background: '#f5b52e' }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400' },
    },
  );
}
