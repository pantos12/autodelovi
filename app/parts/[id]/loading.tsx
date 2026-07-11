export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '20px', background: '#1a1b1f', borderRadius: '6px', width: '300px', marginBottom: '24px' }} />
        <div className="part-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', height: '320px', marginBottom: '24px', animation: 'shimmer 1.5s infinite', backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)' }} />
            <div style={{ height: '32px', background: '#1a1b1f', borderRadius: '8px', width: '60%', marginBottom: '12px' }} />
            <div style={{ height: '20px', background: '#1a1b1f', borderRadius: '6px', width: '40%', marginBottom: '24px' }} />
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
