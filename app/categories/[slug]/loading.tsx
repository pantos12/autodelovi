export default function CategoryLoading() {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
    backgroundSize: '400% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ ...shimmerStyle, width: '250px', height: '14px', marginBottom: '16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ ...shimmerStyle, width: '48px', height: '48px', borderRadius: '50%' }} />
            <div>
              <div style={{ ...shimmerStyle, width: '180px', height: '28px', marginBottom: '8px' }} />
              <div style={{ ...shimmerStyle, width: '120px', height: '14px' }} />
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid #252629' }}>
              <div style={{ ...shimmerStyle, height: '130px', borderRadius: 0 }} />
              <div style={{ padding: '12px' }}>
                <div style={{ ...shimmerStyle, height: '12px', width: '50%', marginBottom: '6px' }} />
                <div style={{ ...shimmerStyle, height: '14px', width: '70%', marginBottom: '10px' }} />
                <div style={{ ...shimmerStyle, height: '18px', width: '35%', marginBottom: '10px' }} />
                <div style={{ ...shimmerStyle, height: '32px', width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
