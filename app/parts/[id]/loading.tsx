export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '16px', width: '200px', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
        <div className="part-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', height: '320px', borderRadius: '16px', marginBottom: '24px' }} />
            <div style={{ height: '28px', width: '60%', background: '#252629', borderRadius: '4px', marginBottom: '12px' }} />
            <div style={{ height: '16px', width: '40%', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', height: '200px' }} />
          </div>
          <div className="part-detail-buy-card">
            <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', height: '300px' }}>
              <div style={{ height: '32px', width: '50%', background: '#252629', borderRadius: '4px', marginBottom: '12px' }} />
              <div style={{ height: '16px', width: '30%', background: '#252629', borderRadius: '4px', marginBottom: '20px' }} />
              <div style={{ height: '48px', background: '#252629', borderRadius: '10px', marginBottom: '12px' }} />
              <div style={{ height: '48px', background: '#252629', borderRadius: '10px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
