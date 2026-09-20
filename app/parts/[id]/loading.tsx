export default function PartLoading() {
  const shimmer = {
    animation: 'shimmer 1.5s infinite linear',
    backgroundImage: 'linear-gradient(90deg, #252629 0%, #333 50%, #252629 100%)',
    backgroundSize: '200% 100%',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '14px', width: '240px', background: '#252629', marginBottom: '24px', borderRadius: '4px', ...shimmer }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
          <div>
            <div style={{ height: '400px', background: '#1a1b1f', borderRadius: '12px', marginBottom: '16px', ...shimmer }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ width: '72px', height: '72px', background: '#1a1b1f', borderRadius: '8px', ...shimmer }} />
              ))}
            </div>
          </div>
          <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '24px', border: '1px solid #2a2b2f' }}>
            <div style={{ height: '20px', width: '70%', marginBottom: '12px', ...shimmer }} />
            <div style={{ height: '14px', width: '50%', marginBottom: '20px', ...shimmer }} />
            <div style={{ height: '36px', width: '45%', marginBottom: '24px', ...shimmer }} />
            <div style={{ height: '48px', width: '100%', borderRadius: '10px', ...shimmer }} />
          </div>
        </div>
      </div>
    </div>
  );
}
