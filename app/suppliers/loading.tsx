export default function SuppliersLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ height: 40, width: 300, borderRadius: 8, background: '#252629', margin: '0 auto 16px' }} />
        <div style={{ height: 18, width: 500, maxWidth: '90%', borderRadius: 4, background: '#252629', margin: '0 auto' }} />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: 12, padding: 24, border: '1px solid #252629' }}>
              <div style={{ height: 20, width: '60%', borderRadius: 6, background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', marginBottom: 8 }} />
              <div style={{ height: 14, width: '40%', borderRadius: 4, background: '#252629', marginBottom: 16 }} />
              <div style={{ height: 14, width: '80%', borderRadius: 4, background: '#252629', marginBottom: 8 }} />
              <div style={{ height: 14, width: '70%', borderRadius: 4, background: '#252629', marginBottom: 16 }} />
              <div style={{ height: 36, borderRadius: 8, background: '#252629' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
