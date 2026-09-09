'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface RecentItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  brand: string;
}

const STORAGE_KEY = 'ads_recently_viewed';
const MAX_ITEMS = 8;

export function trackView(part: { id: string; slug?: string; name_sr?: string; name: string; price: number; images?: string[]; brand?: string }) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: RecentItem[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter(i => i.id !== part.id);
    filtered.unshift({
      id: part.id,
      slug: part.slug || part.id,
      name: part.name_sr || part.name,
      price: part.price,
      image: part.images?.[0] || null,
      brand: part.brand || '',
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {}
}

export default function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list: RecentItem[] = JSON.parse(raw);
        setItems(excludeId ? list.filter(i => i.id !== excludeId) : list);
      }
    } catch {}
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: '48px' }}>
      <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>Nedavno pregledano</h2>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
        {items.slice(0, 6).map(item => (
          <Link key={item.id} href={`/parts/${item.slug}`} style={{ textDecoration: 'none', flexShrink: 0, width: '160px' }}>
            <div style={{ background: '#1a1b1f', borderRadius: '10px', overflow: 'hidden', border: '1px solid #252629' }}>
              <div style={{ position: 'relative', height: '90px', background: '#252629' }}>
                <Image
                  src={item.image || '/images/part-placeholder.svg'}
                  alt={item.name}
                  fill
                  sizes="160px"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                  unoptimized
                />
              </div>
              <div style={{ padding: '8px 10px' }}>
                <p style={{ color: '#888', fontSize: '10px', marginBottom: '2px' }}>{item.brand}</p>
                <p style={{ color: '#fff', fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                <p style={{ color: '#ff4d00', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>{item.price.toLocaleString('sr-RS')} RSD</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
