export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: '400px' }} />
        <div>
          <div style={{ height: '24px', background: '#1a1b1f', borderRadius: '8px', width: '120px', marginBottom: '20px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', height: '280px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
