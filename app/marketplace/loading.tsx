export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '32px', width: '200px', background: '#1a1b1f', borderRadius: '8px', marginBottom: '24px', animation: 'shimmer 1.5s infinite linear', backgroundImage: 'linear-gradient(90deg, #1a1b1f 0%, #252629 50%, #1a1b1f 100%)', backgroundSize: '200% 100%' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', border: '1px solid #2a2b2f', overflow: 'hidden' }}>
              <div style={{ height: '180px', background: '#252629', animation: 'shimmer 1.5s infinite linear', backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)', backgroundSize: '200% 100%' }} />
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ height: '16px', width: '80%', background: '#252629', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear', backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)', backgroundSize: '200% 100%' }} />
                <div style={{ height: '12px', width: '50%', background: '#252629', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear', backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)', backgroundSize: '200% 100%' }} />
                <div style={{ height: '20px', width: '40%', background: '#252629', borderRadius: '4px', animation: 'shimmer 1.5s infinite linear', backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)', backgroundSize: '200% 100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
