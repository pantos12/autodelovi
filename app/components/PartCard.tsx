'use client';
import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Part } from '@/lib/types';
import { bandEmoji, bandLabel, type Band } from '@/lib/confidence';
import AddToCartButton from './AddToCartButton';
import InquiryButton from './InquiryButton';

function bandForPart(part: Part): Band {
  if ((part.stock_quantity ?? 0) > 0) return 'verified';
  return 'inquiry';
}

function bandColor(band: Band): string {
  if (band === 'verified') return '#22c55e';
  if (band === 'likely') return '#eab308';
  return '#ef4444';
}

export const BandBadge = memo(function BandBadge({ band }: { band: Band }) {
  return (
    <div
      data-testid="band-badge"
      style={{
        position: 'absolute',
        top: 8,
        right: 8,
        background: 'rgba(12,13,15,0.85)',
        color: bandColor(band),
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        backdropFilter: 'blur(4px)',
        border: `1px solid ${bandColor(band)}`,
      }}
      title={bandLabel(band)}
    >
      <span aria-hidden="true">{bandEmoji(band)}</span>
      <span>{bandLabel(band)}</span>
    </div>
  );
});

export const SmartImage = memo(function SmartImage({
  src,
  alt,
  priority,
}: {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
}) {
  const [errored, setErrored] = useState(false);
  const effective = !src || errored ? '/images/part-placeholder.svg' : src;
  return (
    <Image
      src={effective}
      alt={alt}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 220px"
      style={{ objectFit: 'cover' }}
      priority={!!priority}
      loading={priority ? undefined : 'lazy'}
      onError={() => setErrored(true)}
      unoptimized
    />
  );
});

const cardStyle: React.CSSProperties = {
  background: '#1a1b1f',
  borderRadius: '12px',
  overflow: 'hidden',
};

interface PartCardProps {
  part: Part;
  priority?: boolean;
  compareSelected?: boolean;
  onCompareToggle?: (id: string) => void;
  showCompare?: boolean;
  variant?: 'full' | 'compact';
}

export default memo(function PartCard({
  part,
  priority,
  compareSelected,
  onCompareToggle,
  showCompare = false,
  variant = 'full',
}: PartCardProps) {
  const vehicle = part.compatible_vehicles?.[0];
  const inStock = (part.stock_quantity ?? 0) > 0;
  const partUrl = `/parts/${part.slug || part.id}`;
  const band = bandForPart(part);

  if (variant === 'compact') {
    const imgSrc = part.images?.[0] || '/images/part-placeholder.svg';
    return (
      <div data-testid="part-card" style={{ ...cardStyle, border: '1px solid #252629' }}>
        <div style={{ position: 'relative', background: '#252629', height: '130px', overflow: 'hidden' }}>
          <SmartImage src={imgSrc} alt={part.name} priority={priority} />
        </div>
        <div style={{ padding: '12px' }}>
          <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{part.brand || ''}</p>
          <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.name_sr || part.name}</h3>
          <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            {part.price?.toLocaleString('sr-RS')} RSD
          </p>
          <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>
            {inStock ? 'Na stanju' : 'Nema na stanju'}
          </p>
          <Link
            href={partUrl}
            style={{ display: 'block', padding: '8px', background: '#ff4d00', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}
          >
            Vidi više
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="part-card" style={{ ...cardStyle, border: compareSelected ? '2px solid #ff4d00' : '2px solid transparent' }}>
      <div style={{ position: 'relative', background: '#252629', height: '140px', overflow: 'hidden' }}>
        <SmartImage src={part.images?.[0]} alt={part.name} priority={priority} />
        <BandBadge band={band} />
      </div>
      <div style={{ padding: '12px' }}>
        {vehicle && <p style={{ color: '#aaa', fontSize: '11px', marginBottom: '4px' }}>{vehicle.make} {vehicle.model}</p>}
        <h3 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', lineHeight: '1.3' }}>{part.name_sr || part.name}</h3>
        <p style={{ color: '#ff4d00', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{part.price?.toLocaleString('sr-RS')} RSD</p>
        <p style={{ color: inStock ? '#22c55e' : '#ef4444', fontSize: '12px', marginBottom: '10px' }}>{inStock ? 'Na stanju' : 'Nema na stanju'}</p>

        <div style={{ marginBottom: '6px' }}>
          {band === 'inquiry' ? (
            <>
              <InquiryButton part={part} />
              <p style={{ color: '#aaa', fontSize: '11px', fontStyle: 'italic', margin: '6px 0 0' }}>
                Proveri sa prodavcem
              </p>
            </>
          ) : (
            <>
              <AddToCartButton part={part} full inStock={inStock} />
              {band === 'likely' && (
                <p style={{ color: '#888', fontSize: '11px', margin: '6px 0 0' }}>
                  Dostupnost proverena skoro; potvrda pri obradi.
                </p>
              )}
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          <Link href={partUrl} style={{ flex: 1, padding: '8px', background: '#333', borderRadius: '8px', color: '#fff', textDecoration: 'none', textAlign: 'center', fontSize: '13px' }}>Detalji</Link>
          {showCompare && onCompareToggle && (
            <button
              data-testid="compare-toggle"
              onClick={() => onCompareToggle(part.id)}
              style={{ padding: '8px', background: compareSelected ? '#ff4d00' : '#333', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
              aria-label={compareSelected ? 'Ukloni iz poređenja' : 'Dodaj u poređenje'}
            >
              ≈
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
