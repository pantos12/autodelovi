export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '14px', width: '200px', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '16px', height: '320px', marginBottom: '24px' }} />
            <div style={{ height: '28px', width: '60%', background: '#1a1b1f', borderRadius: '6px', marginBottom: '12px' }} />
            <div style={{ height: '16px', width: '40%', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '240px' }} />
          </div>
          <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '300px' }} />
        </div>
      </div>
    </div>
  );
}
