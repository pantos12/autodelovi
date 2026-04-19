export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[80, 100, 120].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, borderRadius: 4, background: '#1a1b1f' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ height: 320, borderRadius: 16, background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: 24 }} />
            <div style={{ height: 32, width: '60%', borderRadius: 8, background: '#1a1b1f', marginBottom: 12 }} />
            <div style={{ height: 16, width: '40%', borderRadius: 4, background: '#1a1b1f', marginBottom: 24 }} />
            <div style={{ background: '#1a1b1f', borderRadius: 12, padding: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 5 ? '1px solid #252629' : 'none' }}>
                  <div style={{ height: 14, width: 100, borderRadius: 4, background: '#252629' }} />
                  <div style={{ height: 14, width: 140, borderRadius: 4, background: '#252629' }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: 16, padding: 24 }}>
              <div style={{ height: 36, width: '50%', borderRadius: 8, background: '#252629', marginBottom: 12 }} />
              <div style={{ height: 16, width: '30%', borderRadius: 4, background: '#252629', marginBottom: 20 }} />
              <div style={{ height: 48, borderRadius: 10, background: '#252629', marginBottom: 12 }} />
              <div style={{ height: 48, borderRadius: 10, background: '#252629' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
