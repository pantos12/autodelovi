export default function SuppliersLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)', padding: '60px 16px', textAlign: 'center' }}>
        <div style={{ height: '36px', width: '300px', background: '#252629', borderRadius: '6px', margin: '0 auto 16px' }} />
        <div style={{ height: '16px', width: '500px', maxWidth: '100%', background: '#252629', borderRadius: '4px', margin: '0 auto' }} />
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px', height: '200px' }} />
          ))}
        </div>
      </div>
    </div>
  );
}
