export default function Loading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #1a1b1f', borderTop: '3px solid #f9372c', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span style={{ color: '#888', fontSize: '14px', fontWeight: 500 }}>Ucitavanje...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
