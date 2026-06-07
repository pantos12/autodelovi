export default function CategoryLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      {/* Hero skeleton */}
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: 48, height: 48, background: '#252629', borderRadius: 8 }} />
            <div>
              <div style={{ width: 200, height: 32, background: '#252629', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: 300, height: 16, background: '#252629', borderRadius: 4 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Parts grid skeleton */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ width: 180, height: 14, background: '#1a1b1f', borderRadius: 4, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ height: 130, backgroundImage: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
              <div style={{ padding: 12 }}>
                <div style={{ width: '40%', height: 11, background: '#252629', borderRadius: 3, marginBottom: 8 }} />
                <div style={{ width: '80%', height: 14, background: '#252629', borderRadius: 4, marginBottom: 10 }} />
                <div style={{ width: '50%', height: 18, background: '#252629', borderRadius: 4, marginBottom: 10 }} />
                <div style={{ width: '100%', height: 34, background: '#252629', borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
