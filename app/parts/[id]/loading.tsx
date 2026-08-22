export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '14px', background: '#252629', borderRadius: '4px', marginBottom: '24px', width: '240px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          <div>
            <div style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '16px', height: '320px', marginBottom: '24px' }} />
            <div style={{ height: '28px', background: '#252629', borderRadius: '6px', marginBottom: '8px', width: '70%' }} />
            <div style={{ height: '16px', background: '#252629', borderRadius: '4px', marginBottom: '24px', width: '40%' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '16px 20px', border: '1px solid #252629' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 5 ? '1px solid #252629' : 'none' }}>
                  <div style={{ height: '14px', background: '#252629', borderRadius: '4px', width: '80px' }} />
                  <div style={{ height: '14px', background: '#252629', borderRadius: '4px', width: '120px' }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629', height: '320px' }}>
            <div style={{ height: '32px', background: '#252629', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
            <div style={{ height: '14px', background: '#252629', borderRadius: '4px', marginBottom: '20px', width: '40%' }} />
            <div style={{ height: '14px', background: '#252629', borderRadius: '4px', marginBottom: '20px', width: '50%' }} />
            <div style={{ height: '44px', background: '#252629', borderRadius: '10px', marginBottom: '12px' }} />
            <div style={{ height: '44px', background: '#252629', borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
