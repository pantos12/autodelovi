export default function CategoryLoading() {
  const shimmerBg =
    'linear-gradient(90deg, #1a1b1f 25%, #252629 50%, #1a1b1f 75%)';

  return (
    <>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>
      <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #1a1b1f 0%, #0c0d0f 100%)',
            padding: '48px 16px',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              style={{
                height: 14,
                width: 200,
                background: shimmerBg,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 6,
                marginBottom: 16,
              }}
            />
            <div
              style={{
                height: 32,
                width: 220,
                background: shimmerBg,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 8,
                marginBottom: 8,
              }}
            />
            <div
              style={{
                height: 16,
                width: 160,
                background: shimmerBg,
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                borderRadius: 6,
              }}
            />
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 16px' }}>
          <div
            style={{
              height: 14,
              width: 180,
              background: shimmerBg,
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: 6,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: shimmerBg,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '12px',
                  height: '260px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
