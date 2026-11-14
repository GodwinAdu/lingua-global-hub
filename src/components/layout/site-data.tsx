'use client';

import { createContext, useContext } from 'react';
import type { TickerItem } from '@/lib/content/types';
import type { SiteSettings } from '@/lib/content/site-types';

type SiteData = { ticker: TickerItem[]; settings: SiteSettings };

const SiteDataContext = createContext<SiteData | null>(null);

/** Site-wide data loaded once by the (site) layout: news headlines and contact settings. */
export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

function useSiteData(): SiteData {
  const data = useContext(SiteDataContext);
  if (!data) throw new Error('useSiteData must be used inside <SiteDataProvider>');
  return data;
}

export function useTickerItems() {
  return useSiteData().ticker;
}

export function useSiteSettings() {
  return useSiteData().settings;
}
