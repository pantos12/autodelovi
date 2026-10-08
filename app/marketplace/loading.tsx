export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div className="skeleton" style={{ height: '400px', borderRadius: '12px' }} />
        <div>
          <div className="skeleton" style={{ height: '32px', width: '200px', marginBottom: '20px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '280px', borderRadius: '12px' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
