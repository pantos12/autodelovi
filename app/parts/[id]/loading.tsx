export default function PartLoading() {
  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="skeleton" style={{ height: '16px', width: '300px', marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px' }}>
          <div>
            <div className="skeleton" style={{ height: '320px', borderRadius: '16px', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '28px', width: '60%', marginBottom: '12px' }} />
            <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '24px' }} />
            <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }} />
          </div>
          <div>
            <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
