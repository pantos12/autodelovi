export default function CategoryLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '14px', background: '#252629', borderRadius: '4px', marginBottom: '24px', width: '200px' }} />
        <div style={{ height: '36px', background: '#252629', borderRadius: '6px', marginBottom: '24px', width: '300px' }} />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto' }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} style={{ height: '36px', background: '#1a1b1f', borderRadius: '8px', width: '100px', flexShrink: 0 }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px', height: '280px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
