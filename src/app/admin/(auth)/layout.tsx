import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted px-4 py-12">
      <Link href="/" className="mb-8 flex items-center gap-2 text-foreground">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Globe className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold">First Grade Lingua</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">{children}</div>
    </div>
  );
}
