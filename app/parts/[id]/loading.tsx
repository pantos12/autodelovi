export default function PartDetailLoading() {
  const shimmerStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ ...shimmerStyle, height: '14px', width: '300px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ ...shimmerStyle, height: '320px', marginBottom: '24px', borderRadius: '16px' }} />
            <div style={{ ...shimmerStyle, height: '28px', width: '60%', marginBottom: '8px' }} />
            <div style={{ ...shimmerStyle, height: '16px', width: '40%', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '16px 20px', border: '1px solid #252629' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 4 ? '1px solid #252629' : 'none' }}>
                  <div style={{ ...shimmerStyle, height: '14px', width: '30%' }} />
                  <div style={{ ...shimmerStyle, height: '14px', width: '40%' }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629' }}>
            <div style={{ ...shimmerStyle, height: '32px', width: '50%', marginBottom: '8px' }} />
            <div style={{ ...shimmerStyle, height: '14px', width: '30%', marginBottom: '20px' }} />
            <div style={{ ...shimmerStyle, height: '44px', width: '100%', marginBottom: '12px' }} />
            <div style={{ ...shimmerStyle, height: '44px', width: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
