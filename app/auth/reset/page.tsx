'use client';
import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/update-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#1a1b1f',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  if (sent) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
          </div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Email poslat</h1>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Proverite vasu email adresu <strong style={{ color: '#fff' }}>{email}</strong> za link za resetovanje lozinke.
          </p>
          <Link href="/auth/login" style={{ color: '#f9372c', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Nazad na prijavu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Zaboravljena lozinka</h1>
        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>
          Unesite vas email i poslaćemo vam link za resetovanje lozinke.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Email adresa</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="vas@email.com"
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: loading ? '#666' : '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Slanje...' : 'Posalji link za reset'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '24px' }}>
          <Link href="/auth/login" style={{ color: '#f9372c', textDecoration: 'none', fontWeight: 600 }}>
            Nazad na prijavu
          </Link>
        </p>
      </div>
    </div>
  );
}
