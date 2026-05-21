export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ height: '20px', width: '300px', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div style={{ height: '320px', background: '#1a1b1f', borderRadius: '16px', marginBottom: '24px', animation: 'shimmer 1.5s infinite', backgroundImage: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)', backgroundSize: '200% 100%' }} />
            <div style={{ height: '28px', width: '60%', background: '#1a1b1f', borderRadius: '6px', marginBottom: '12px' }} />
            <div style={{ height: '16px', width: '40%', background: '#1a1b1f', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: '16px', background: '#252629', borderRadius: '4px', marginBottom: '12px', width: `${70 + Math.random() * 30}%` }} />
              ))}
            </div>
          </div>
          <div>
            <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '24px', height: '300px' }}>
              <div style={{ height: '32px', width: '50%', background: '#252629', borderRadius: '6px', marginBottom: '16px' }} />
              <div style={{ height: '16px', width: '30%', background: '#252629', borderRadius: '4px', marginBottom: '24px' }} />
              <div style={{ height: '44px', background: '#252629', borderRadius: '10px', marginBottom: '12px' }} />
              <div style={{ height: '44px', background: '#252629', borderRadius: '10px' }} />
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }`}</style>
    </div>
  );
}
