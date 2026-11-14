'use client';

import { createContext, useContext } from 'react';
import type { TickerItem } from '@/lib/content/types';

const NewsTickerContext = createContext<TickerItem[]>([]);

export function NewsTickerProvider({ items, children }: { items: TickerItem[]; children: React.ReactNode }) {
  return <NewsTickerContext.Provider value={items}>{children}</NewsTickerContext.Provider>;
}

export function useTickerItems() {
  return useContext(NewsTickerContext);
}
