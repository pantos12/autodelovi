export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '16px', width: '240px', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '320px', marginBottom: '24px', animation: 'pulse 2s infinite' }} />
            <div style={{ height: '28px', width: '60%', background: '#252629', borderRadius: '6px', marginBottom: '12px' }} />
            <div style={{ height: '16px', width: '40%', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '200px' }} />
          </div>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '300px', animation: 'pulse 2s infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
