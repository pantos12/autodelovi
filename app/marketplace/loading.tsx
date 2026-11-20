export default function MarketplaceLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 768px) { .ml-container { grid-template-columns: 1fr !important; } .ml-sidebar { display: none !important; } }
      `}</style>
      <div className="ml-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        <div className="ml-sidebar" style={{ background: '#1a1b1f', borderRadius: '12px', padding: '20px', height: '400px' }} />
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ width: '120px', height: '20px', background: '#1a1b1f', borderRadius: '4px' }} />
            <div style={{ width: '160px', height: '36px', background: '#1a1b1f', borderRadius: '8px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: 'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '12px',
                  height: '280px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
