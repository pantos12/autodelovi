import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .footer-inner { flex-direction: column; align-items: center; text-align: center; }
          .footer-links { justify-content: center; }
        }
      `}</style>
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', background: '#0c0d0f' }}>
        <div className="footer-inner" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>© 2026 AutoDelovi.sale</span>
          <div className="footer-links" style={{ display: 'flex', gap: '24px' }}>
            <Link href="/marketplace" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Marketplace</Link>
            <Link href="/suppliers" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Dobavljaci</Link>
            <Link href="/comparison" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Poredenje</Link>
            <Link href="/vehicle-selection" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Izbor vozila</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
