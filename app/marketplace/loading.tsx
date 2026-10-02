export default function MarketplaceLoading() {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ ...shimmerStyle, height: '32px', width: '200px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
              <div style={{ ...shimmerStyle, height: '160px', borderRadius: 0 }} />
              <div style={{ padding: '14px' }}>
                <div style={{ ...shimmerStyle, height: '12px', width: '60%', marginBottom: '8px' }} />
                <div style={{ ...shimmerStyle, height: '16px', width: '80%', marginBottom: '12px' }} />
                <div style={{ ...shimmerStyle, height: '20px', width: '40%', marginBottom: '12px' }} />
                <div style={{ ...shimmerStyle, height: '36px', width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
