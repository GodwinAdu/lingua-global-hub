'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Re-renders the order page every 4 seconds (up to 3 minutes) while payment is pending. */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      if (tries > 45) clearInterval(id);
      else router.refresh();
    }, 4000);
    return () => clearInterval(id);
  }, [router]);
  return null;
}
