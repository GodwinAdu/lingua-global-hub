'use client';

import { createContext, useContext } from 'react';
import type { TickerItem } from '@/lib/content/types';
import type { SiteSettings } from '@/lib/content/site-types';
import type { HomeSection } from '@/lib/content/home';

type SiteData = { ticker: TickerItem[]; settings: SiteSettings; cta: HomeSection };

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

/** Call-to-action band content (edited under Website > Home page), shared by every page that shows it. */
export function useCtaSection() {
  return useSiteData().cta;
}
