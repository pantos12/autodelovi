import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
        &copy; {new Date().getFullYear()} AutoDelovi.sale
      </span>
      <div style={{ display: 'flex', gap: '24px' }}>
        <Link href="/marketplace" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Marketplace</Link>
        <Link href="/suppliers" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Dobavljaci</Link>
        <Link href="/comparison" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>Poredenje</Link>
      </div>
    </footer>
  );
}
