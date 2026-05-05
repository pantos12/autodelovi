export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div className="marketplace-layout" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        {/* Sidebar skeleton */}
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: '400px' }}>
          <div style={{ height: '14px', width: '60%', background: '#252629', borderRadius: '4px', marginBottom: '16px' }} />
          <div style={{ height: '40px', background: '#252629', borderRadius: '8px', marginBottom: '20px' }} />
          <div style={{ height: '14px', width: '40%', background: '#252629', borderRadius: '4px', marginBottom: '12px' }} />
          <div style={{ height: '40px', background: '#252629', borderRadius: '8px', marginBottom: '16px' }} />
          <div style={{ height: '14px', width: '50%', background: '#252629', borderRadius: '4px', marginBottom: '12px' }} />
          <div style={{ height: '40px', background: '#252629', borderRadius: '8px' }} />
        </div>
        {/* Grid skeleton */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ height: '16px', width: '120px', background: '#252629', borderRadius: '4px' }} />
            <div style={{ height: '36px', width: '180px', background: '#252629', borderRadius: '8px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', borderRadius: '12px', height: '280px', animation: 'shimmer 1.5s infinite' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
