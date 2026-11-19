export default function PartDetailLoading() {
  const shimmer = {
    background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '12px',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ ...shimmer, width: '300px', height: '16px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ ...shimmer, height: '320px', marginBottom: '24px' }} />
            <div style={{ ...shimmer, width: '70%', height: '28px', marginBottom: '12px' }} />
            <div style={{ ...shimmer, width: '40%', height: '16px', marginBottom: '24px' }} />
            <div style={{ ...shimmer, height: '200px' }} />
          </div>
          <div style={{ ...shimmer, height: '300px' }} />
        </div>
      </div>
    </div>
  );
}
