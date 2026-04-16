'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Pogrešan email ili lozinka'
        : authError.message);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#1a1b1f',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Prijava</h1>
        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>Ulogujte se na svoj nalog</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Lozinka</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Unesite lozinku" required minLength={6} style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#666' : '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '24px' }}>
          Nemate nalog?{' '}
          <Link href="/auth/signup" style={{ color: '#f9372c', textDecoration: 'none', fontWeight: 600 }}>Registrujte se</Link>
        </p>
      </div>
    </div>
  );
}
