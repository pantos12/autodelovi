export default function PartDetailLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <div style={{ height: '14px', width: '60px', background: '#252629', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '8px', background: '#252629', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '80px', background: '#252629', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '8px', background: '#252629', borderRadius: '4px' }} />
          <div style={{ height: '14px', width: '140px', background: '#252629', borderRadius: '4px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
          <div>
            {/* Image skeleton */}
            <div style={{ height: '320px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '16px', marginBottom: '24px' }} />
            {/* Title skeleton */}
            <div style={{ height: '28px', width: '70%', background: '#252629', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '16px', width: '40%', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
            {/* Specs skeleton */}
            <div style={{ background: '#1a1b1f', borderRadius: '12px', border: '1px solid #252629', overflow: 'hidden' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < 5 ? '1px solid #252629' : 'none' }}>
                  <div style={{ height: '14px', width: '80px', background: '#252629', borderRadius: '4px' }} />
                  <div style={{ height: '14px', width: '120px', background: '#252629', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>
          {/* Buy card skeleton */}
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', border: '1px solid #252629' }}>
            <div style={{ height: '32px', width: '60%', background: '#252629', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '14px', width: '40%', background: '#252629', borderRadius: '4px', marginBottom: '20px' }} />
            <div style={{ height: '48px', background: '#252629', borderRadius: '10px', marginBottom: '12px' }} />
            <div style={{ height: '44px', background: '#252629', borderRadius: '10px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
