export default function CategoryLoading() {
  const shimmer = {
    animation: 'shimmer 1.5s infinite linear',
    backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ height: '28px', width: '220px', marginBottom: '24px', ...shimmer }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', border: '1px solid #2a2b2f', overflow: 'hidden' }}>
              <div style={{ height: '160px', ...shimmer }} />
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '14px', width: '75%', ...shimmer }} />
                <div style={{ height: '12px', width: '40%', ...shimmer }} />
                <div style={{ height: '18px', width: '35%', ...shimmer }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
