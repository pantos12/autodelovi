'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery({ images, alt }: { images?: string[]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const [errored, setErrored] = useState<Set<number>>(new Set());
  const list = images?.length ? images : [];
  const src = list[selected] && !errored.has(selected)
    ? list[selected]
    : '/images/part-placeholder.svg';
  const isPlaceholder = src === '/images/part-placeholder.svg';

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ position: 'relative', background: '#1a1b1f', borderRadius: '16px', height: '320px', border: '1px solid #252629', overflow: 'hidden' }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1200px) 100vw, 800px"
          style={{ objectFit: isPlaceholder ? 'cover' : 'contain', padding: isPlaceholder ? 0 : '16px' }}
          priority
          unoptimized
          onError={() => setErrored(prev => new Set(prev).add(selected))}
        />
      </div>
      {list.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                position: 'relative',
                width: '64px',
                height: '64px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: i === selected ? '2px solid #ff4d00' : '2px solid #252629',
                background: '#1a1b1f',
                cursor: 'pointer',
                flexShrink: 0,
                padding: 0,
                opacity: errored.has(i) ? 0.4 : 1,
              }}
            >
              <Image
                src={errored.has(i) ? '/images/part-placeholder.svg' : img}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="64px"
                style={{ objectFit: 'cover' }}
                loading="lazy"
                unoptimized
                onError={() => setErrored(prev => new Set(prev).add(i))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
