export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div style={{ background: '#1a1b1f', borderRadius: '4px', height: '16px', width: '200px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '320px', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '4px', height: '28px', width: '70%', marginBottom: '8px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '4px', height: '16px', width: '40%', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '200px' }} />
          </div>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '300px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
