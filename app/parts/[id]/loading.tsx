export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[80, 100, 60].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, background: '#1a1b1f', borderRadius: 4 }} />
          ))}
        </div>
        <div className="part-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ height: 320, background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: 16, marginBottom: 24 }} />
            <div style={{ height: 28, width: '60%', background: '#1a1b1f', borderRadius: 6, marginBottom: 12 }} />
            <div style={{ height: 16, width: '40%', background: '#1a1b1f', borderRadius: 4, marginBottom: 24 }} />
            <div style={{ height: 200, background: '#1a1b1f', borderRadius: 12 }} />
          </div>
          <div>
            <div style={{ height: 300, background: '#1a1b1f', borderRadius: 16 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
