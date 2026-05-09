export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ height: '20px', width: '200px', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{
              height: '320px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
              borderRadius: '16px', marginBottom: '24px',
            }} />
            <div style={{ height: '32px', width: '60%', background: '#1a1b1f', borderRadius: '8px', marginBottom: '12px' }} />
            <div style={{ height: '16px', width: '40%', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ height: '200px', background: '#1a1b1f', borderRadius: '12px' }} />
          </div>
          <div style={{ height: '300px', background: '#1a1b1f', borderRadius: '16px' }} />
        </div>
      </div>
    </div>
  );
}
