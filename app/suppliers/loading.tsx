export default function SuppliersLoading() {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ ...shimmerStyle, height: '32px', width: '200px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', border: '1px solid #252629' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ ...shimmerStyle, width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ ...shimmerStyle, height: '16px', width: '60%', marginBottom: '6px' }} />
                  <div style={{ ...shimmerStyle, height: '12px', width: '40%' }} />
                </div>
              </div>
              <div style={{ ...shimmerStyle, height: '12px', width: '80%', marginBottom: '8px' }} />
              <div style={{ ...shimmerStyle, height: '12px', width: '50%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
