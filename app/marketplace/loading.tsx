export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: '400px' }}>
          <div style={{ background: '#252629', borderRadius: '8px', height: '36px', marginBottom: '16px' }} />
          <div style={{ background: '#252629', borderRadius: '8px', height: '36px', marginBottom: '16px' }} />
          <div style={{ background: '#252629', borderRadius: '8px', height: '36px', marginBottom: '16px' }} />
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ background: '#1a1b1f', borderRadius: '8px', height: '24px', width: '120px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '8px', height: '36px', width: '180px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', height: '280px' }}>
                <div style={{ background: '#252629', height: '140px', borderRadius: '12px 12px 0 0' }} />
                <div style={{ padding: '12px' }}>
                  <div style={{ background: '#252629', borderRadius: '4px', height: '14px', marginBottom: '8px', width: '80%' }} />
                  <div style={{ background: '#252629', borderRadius: '4px', height: '20px', marginBottom: '8px', width: '60%' }} />
                  <div style={{ background: '#252629', borderRadius: '4px', height: '12px', width: '40%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
