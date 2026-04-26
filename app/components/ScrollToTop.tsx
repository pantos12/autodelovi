'use client';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Vrati se na vrh"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(26, 27, 31, 0.9)',
        border: '1px solid #333',
        color: '#fff',
        fontSize: '18px',
        cursor: 'pointer',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        transition: 'opacity 0.2s, transform 0.2s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      ↑
    </button>
  );
}
