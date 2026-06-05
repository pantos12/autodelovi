'use client';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Vrati se na vrh"
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'rgba(249, 55, 44, 0.9)',
        border: 'none',
        color: '#fff',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 50,
        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}
    >
      ↑
    </button>
  );
}
