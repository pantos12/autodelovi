export default function CartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' }}>
        <div style={{ height: '32px', width: '200px', background: '#252629', borderRadius: '8px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ height: '92px', background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', borderRadius: '12px' }} />
            ))}
          </div>
          <div style={{ height: '260px', background: '#1a1b1f', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
}
