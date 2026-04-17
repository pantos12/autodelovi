export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '20px', background: '#1a1b1f', borderRadius: '4px', width: '300px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '16px', height: '320px', marginBottom: '24px' }} />
            <div style={{ height: '28px', background: '#1a1b1f', borderRadius: '6px', width: '60%', marginBottom: '12px' }} />
            <div style={{ height: '16px', background: '#1a1b1f', borderRadius: '4px', width: '40%', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '250px' }} />
          </div>
          <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '350px' }} />
        </div>
      </div>
    </div>
  );
}
