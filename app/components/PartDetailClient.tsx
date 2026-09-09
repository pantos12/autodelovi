'use client';
import { useEffect } from 'react';
import { trackView } from './RecentlyViewed';
import RecentlyViewed from './RecentlyViewed';
import type { Part } from '@/lib/types';

export function TrackPartView({ part }: { part: Part }) {
  useEffect(() => {
    trackView(part);
  }, [part]);
  return null;
}

export function RecentlyViewedSection({ partId }: { partId: string }) {
  return <RecentlyViewed excludeId={partId} />;
}
