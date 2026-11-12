export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          <div style={{ width: '60px', height: '14px', background: '#1a1b1f', borderRadius: '4px' }} />
          <div style={{ width: '100px', height: '14px', background: '#1a1b1f', borderRadius: '4px' }} />
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              style={{
                height: '320px',
                background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '16px',
                marginBottom: '24px',
              }}
            />
            <div style={{ width: '60%', height: '28px', background: '#1a1b1f', borderRadius: '6px', marginBottom: '12px' }} />
            <div style={{ width: '40%', height: '16px', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ height: '200px', background: '#1a1b1f', borderRadius: '12px' }} />
          </div>
          <div>
            <div style={{ height: '300px', background: '#1a1b1f', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
