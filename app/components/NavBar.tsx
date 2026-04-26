'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { useCart } from './CartProvider';
import type { User } from '@supabase/supabase-js';

const navLinks = [
  { href: '/marketplace', label: 'MARKETPLACE' },
  { href: '/suppliers', label: 'DOBAVLJAČI' },
  { href: '/vehicle-selection', label: 'IZBOR VOZILA' },
  { href: '/comparison', label: 'POREĐENJE' },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user)).catch(() => {});
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserMenuOpen(false);
    router.refresh();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim().length >= 2) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-search-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu { display: none !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', height: '64px', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(12,13,15,0.97)', backdropFilter: 'blur(12px)', gap: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none', zIndex: 101, flexShrink: 0 }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="nav-search-desktop" style={{ display: 'flex', flex: 1, maxWidth: '360px' }}>
          <div style={{ display: 'flex', width: '100%', background: '#1a1b1f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pretrazi delove..."
              style={{ flex: 1, padding: '8px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '8px 14px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>
              🔍
            </button>
          </div>
        </form>

        {/* Desktop links */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
          {navLinks.map(link => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link key={link.href} href={link.href} style={{ color: active ? '#f9372c' : 'rgba(255,255,255,0.55)', fontWeight: active ? 600 : 400, fontSize: '13px', letterSpacing: '1px', textDecoration: 'none', borderBottom: active ? '2px solid #f9372c' : '2px solid transparent', paddingBottom: '2px', transition: 'color 0.15s', whiteSpace: 'nowrap' }}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Cart + Auth buttons - desktop */}
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <Link href="/cart" style={{ position: 'relative', textDecoration: 'none', fontSize: '20px', padding: '4px' }}>
            🛒
            {cartCount > 0 && (
              <span data-testid="nav-cart-count" style={{ position: 'absolute', top: '-4px', right: '-8px', background: '#f9372c', color: '#fff', fontSize: '10px', fontWeight: 700, borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
        <div className="nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {user ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ background: '#f9372c', border: 'none', borderRadius: '50%', width: '34px', height: '34px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {user.email?.[0]?.toUpperCase() || 'U'}
              </button>
              {userMenuOpen && (
                <div style={{ position: 'absolute', top: '42px', right: 0, background: '#1a1b1f', border: '1px solid #333', borderRadius: '8px', padding: '8px 0', minWidth: '180px', zIndex: 200 }}>
                  <div style={{ padding: '8px 16px', color: '#888', fontSize: '12px', borderBottom: '1px solid #333' }}>
                    {user.email}
                  </div>
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', cursor: 'pointer', textAlign: 'left' }}>
                    Odjavi se
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
                Prijava
              </Link>
              <Link href="/auth/signup" style={{ background: '#f9372c', color: '#fff', padding: '7px 16px', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
                Registracija
              </Link>
            </>
          )}
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
        {/* Mobile search */}
        <form onSubmit={handleSearch} style={{ padding: '0 24px 16px' }}>
          <div style={{ display: 'flex', background: '#1a1b1f', borderRadius: '8px', border: '1px solid #333', overflow: 'hidden' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Pretrazi delove..."
              style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '10px 14px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }}>
              🔍
            </button>
          </div>
        </form>

        {navLinks.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '14px 24px', color: active ? '#f9372c' : 'rgba(255,255,255,0.7)', fontWeight: active ? 600 : 400, fontSize: '14px', letterSpacing: '1px', textDecoration: 'none', borderLeft: active ? '3px solid #f9372c' : '3px solid transparent' }}>
              {link.label}
            </Link>
          );
        })}

        {/* Mobile cart link */}
        <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', color: pathname === '/cart' ? '#f9372c' : 'rgba(255,255,255,0.7)', fontWeight: pathname === '/cart' ? 600 : 400, fontSize: '14px', letterSpacing: '1px', textDecoration: 'none', borderLeft: pathname === '/cart' ? '3px solid #f9372c' : '3px solid transparent' }}>
          <span>🛒 KORPA</span>
          {cartCount > 0 && (
            <span style={{ background: '#f9372c', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '10px', padding: '2px 8px', minWidth: '20px', textAlign: 'center' }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* Mobile auth */}
        <div style={{ margin: '16px 24px 0', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px' }}>
          {user ? (
            <button onClick={handleLogout} style={{ flex: 1, padding: '12px', background: '#333', border: 'none', borderRadius: '8px', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
              Odjavi se ({user.email?.split('@')[0]})
            </button>
          ) : (
            <>
              <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '12px', background: '#333', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600, textAlign: 'center' }}>
                Prijava
              </Link>
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ flex: 1, padding: '12px', background: '#f9372c', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, textAlign: 'center' }}>
                Registracija
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
