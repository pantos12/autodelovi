export default function Loading() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            border: '3px solid #333',
            borderTopColor: '#f9372c',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#aaa', fontSize: '14px' }}>Ucitavanje...</p>
      </div>
    </div>
  );
}
