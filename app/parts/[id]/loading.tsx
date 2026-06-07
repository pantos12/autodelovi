export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Breadcrumb skeleton */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[80, 100, 120].map((w, i) => (
            <div key={i} style={{ width: w, height: 16, background: '#1a1b1f', borderRadius: 4 }} />
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            {/* Image skeleton */}
            <div style={{ height: 320, background: '#1a1b1f', borderRadius: 16, marginBottom: 24, animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%' }} />
            {/* Title skeleton */}
            <div style={{ width: '70%', height: 28, background: '#1a1b1f', borderRadius: 6, marginBottom: 12 }} />
            <div style={{ width: '40%', height: 16, background: '#1a1b1f', borderRadius: 4, marginBottom: 24 }} />
            {/* Specs skeleton */}
            <div style={{ background: '#1a1b1f', borderRadius: 12, overflow: 'hidden' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #252629' }}>
                  <div style={{ width: 80, height: 14, background: '#252629', borderRadius: 4 }} />
                  <div style={{ width: 120, height: 14, background: '#252629', borderRadius: 4 }} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* Buy card skeleton */}
            <div style={{ background: '#1a1b1f', borderRadius: 16, padding: 24 }}>
              <div style={{ width: '60%', height: 32, background: '#252629', borderRadius: 6, marginBottom: 8 }} />
              <div style={{ width: '30%', height: 14, background: '#252629', borderRadius: 4, marginBottom: 20 }} />
              <div style={{ width: '100%', height: 48, background: '#252629', borderRadius: 10, marginBottom: 12 }} />
              <div style={{ width: '100%', height: 48, background: '#252629', borderRadius: 10 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
