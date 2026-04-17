export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '400px' }} />
        <div>
          <div style={{ height: '36px', background: '#1a1b1f', borderRadius: '8px', marginBottom: '20px', width: '200px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px', height: '280px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
