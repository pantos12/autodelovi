export default function MarketplaceLoading() {
  const shimmerBg =
    'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)';

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 768px) {
          .mp-skel-layout { grid-template-columns: 1fr !important; }
          .mp-skel-sidebar { display: none !important; }
        }
      `}</style>
      <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
        <div
          className="mp-skel-layout"
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '24px 16px',
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '24px',
          }}
        >
          <div
            className="mp-skel-sidebar"
            style={{
              background: '#1a1b1f',
              borderRadius: '12px',
              padding: '20px',
              height: '320px',
            }}
          >
            {[120, 40, 40, 40].map((h, i) => (
              <div
                key={i}
                style={{
                  height: h,
                  background: shimmerBg,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '8px',
                  marginBottom: '12px',
                }}
              />
            ))}
          </div>

          <div>
            <div
              style={{
                height: '20px',
                width: '140px',
                background: shimmerBg,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: '6px',
                marginBottom: '20px',
              }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: shimmerBg,
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
    </>
  );
}
