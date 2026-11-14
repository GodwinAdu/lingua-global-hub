import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/** Navbar + hero band + footer, matching the Blog page look. */
export function EbookPageShell({
  title,
  intro,
  children,
}: {
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-primary pb-16 pt-32 text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,_hsl(217_91%_50%_/_0.15)_0%,_transparent_50%)]" />
          <div className="container-premium relative z-10 text-center">
            <h1 className="font-display text-3xl font-bold md:text-5xl">{title}</h1>
            {intro && <div className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/70">{intro}</div>}
          </div>
        </section>
        <section className="bg-background py-14">
          <div className="container-premium">{children}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
