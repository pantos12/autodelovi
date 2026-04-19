export default function OrderLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#1a1b1f', margin: '0 auto 16px' }} />
          <div style={{ height: 28, width: 240, borderRadius: 8, background: '#1a1b1f', margin: '0 auto 8px' }} />
          <div style={{ height: 16, width: 180, borderRadius: 4, background: '#252629', margin: '0 auto' }} />
        </div>
        <div style={{ background: '#1a1b1f', borderRadius: 12, padding: 24, border: '1px solid #252629' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: i < 3 ? '1px solid #252629' : 'none' }}>
              <div style={{ height: 14, width: 120, borderRadius: 4, background: '#252629' }} />
              <div style={{ height: 14, width: 160, borderRadius: 4, background: '#252629' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
