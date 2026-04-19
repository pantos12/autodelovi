export default function CategoryLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ height: 32, width: 200, borderRadius: 8, background: '#1a1b1f', marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 140, background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ padding: 12 }}>
                <div style={{ height: 14, width: '70%', borderRadius: 4, background: '#252629', marginBottom: 8 }} />
                <div style={{ height: 20, width: '40%', borderRadius: 4, background: '#252629', marginBottom: 8 }} />
                <div style={{ height: 36, borderRadius: 8, background: '#252629' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
