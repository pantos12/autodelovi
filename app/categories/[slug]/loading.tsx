export default function CategoryLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ height: '14px', background: '#252629', borderRadius: '4px', width: '200px', marginBottom: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', background: '#252629', borderRadius: '8px' }} />
            <div>
              <div style={{ height: '28px', background: '#252629', borderRadius: '4px', width: '180px', marginBottom: '8px' }} />
              <div style={{ height: '14px', background: '#252629', borderRadius: '4px', width: '240px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ height: '14px', background: '#252629', borderRadius: '4px', width: '160px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '12px',
                height: '260px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
