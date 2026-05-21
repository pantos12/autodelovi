export default function CategoryLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ background: '#1a1b1f', padding: '48px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ height: '16px', width: '200px', background: '#252629', borderRadius: '4px', marginBottom: '16px' }} />
          <div style={{ height: '32px', width: '300px', background: '#252629', borderRadius: '6px' }} />
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ background: '#1a1b1f', borderRadius: '12px', overflow: 'hidden', height: '280px', animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%' }} />
          ))}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}
