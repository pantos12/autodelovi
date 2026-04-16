'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-browser';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Lozinke se ne poklapaju');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', background: '#1a1b1f',
    border: '1px solid #333', borderRadius: '8px', color: '#fff',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  if (success) {
    return (
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Proverite email</h1>
          <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.6 }}>
            Poslali smo vam link za potvrdu na <strong style={{ color: '#fff' }}>{email}</strong>. Kliknite na link da aktivirate nalog.
          </p>
          <Link href="/auth/login" style={{ display: 'inline-block', marginTop: '24px', color: '#f9372c', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
            Nazad na prijavu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>Registracija</h1>
        <p style={{ color: '#888', fontSize: '14px', textAlign: 'center', marginBottom: '32px' }}>Kreirajte novi nalog</p>

        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vas@email.com" required style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Lozinka</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 karaktera" required minLength={6} style={inputStyle} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#aaa', fontSize: '13px', marginBottom: '6px' }}>Potvrdite lozinku</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Ponovite lozinku" required minLength={6} style={inputStyle} />
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#ef4444', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: loading ? '#666' : '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Registracija...' : 'Registruj se'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px', marginTop: '24px' }}>
          Već imate nalog?{' '}
          <Link href="/auth/login" style={{ color: '#f9372c', textDecoration: 'none', fontWeight: 600 }}>Prijavite se</Link>
        </p>
      </div>
    </div>
  );
}
