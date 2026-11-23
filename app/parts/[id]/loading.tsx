export default function PartDetailLoading() {
  const shimmerBg =
    'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)';
  const block = (h: number | string, w?: string): React.CSSProperties => ({
    height: h,
    width: w ?? '100%',
    background: shimmerBg,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
    marginBottom: '12px',
  });

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 900px) {
          .pd-skel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
          <div style={block(16, '240px')} />

          <div
            className="pd-skel-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 360px',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            <div>
              <div style={{ ...block('320px'), borderRadius: '16px' }} />
              <div style={block(28, '60%')} />
              <div style={block(16, '40%')} />
              <div
                style={{
                  background: '#1a1b1f',
                  borderRadius: '12px',
                  padding: '20px',
                  marginTop: '12px',
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ ...block(14, '30%'), marginBottom: 0 }} />
                    <div style={{ ...block(14, '25%'), marginBottom: 0 }} />
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: '#1a1b1f',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #252629',
              }}
            >
              <div style={block(32, '50%')} />
              <div style={block(14, '30%')} />
              <div style={{ ...block(48), borderRadius: '10px', marginTop: '16px' }} />
              <div style={{ ...block(48), borderRadius: '10px' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
