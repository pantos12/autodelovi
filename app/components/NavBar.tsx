'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/marketplace', label: 'MARKETPLACE' },
  { href: '/suppliers', label: 'DOBAVLJACI' },
  { href: '/vehicle-selection', label: 'IZBOR VOZILA' },
  { href: '/comparison', label: 'POREDENJE' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(12,13,15,0.97)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" style={{ textDecoration: 'none', zIndex: 101 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} style={{ color: active ? '#f9372c' : 'rgba(255,255,255,0.55)', fontWeight: active ? 600 : 400, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: active ? '2px solid #f9372c' : '2px solid transparent', paddingBottom: '2px', transition: 'color 0.15s' }}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', zIndex: 101 }}>
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: '#fff', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className="nav-mobile-menu" style={{ position: 'fixed', top: '64px', left: 0, right: 0, background: 'rgba(12,13,15,0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)', zIndex: 99, transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.25s ease', padding: menuOpen ? '16px 0 24px' : '0' }}>
        {navLinks.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 24px', color: active ? '#f9372c' : 'rgba(255,255,255,0.7)', fontWeight: active ? 600 : 400, fontSize: '14px', letterSpacing: '1px', textDecoration: 'none', borderLeft: active ? '3px solid #f9372c' : '3px solid transparent' }}>
              {link.label}
            </Link>
          );
        })}
        <div style={{ margin: '16px 24px 0', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link href="/vehicle-selection" onClick={() => setMenuOpen(false)} style={{ display: 'block', background: '#f9372c', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textAlign: 'center' }}>
            NADJI DELOVE ZA VOZILO
          </Link>
        </div>
      </div>
    </>
  );
}
