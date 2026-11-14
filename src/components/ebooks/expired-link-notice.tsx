'use client';

import { useSearchParams } from 'next/navigation';

export function ExpiredLinkNotice() {
  const params = useSearchParams();
  if (params.get('link') !== 'expired') return null;
  return (
    <div role="alert" className="mx-auto mb-10 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
      That download link has expired or has been used the maximum number of times. Get the book again below, or
      contact us if you bought it and need a new link.
    </div>
  );
}
