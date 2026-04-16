'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase-browser';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') as 'email' | 'recovery' | 'invite' | 'email_change' | null;
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMsg(errorDescription || error);
      setStatus('error');
      return;
    }

    if (tokenHash && type) {
      // Verify the token directly on this page for a fully branded experience
      const supabase = createClient();
      supabase.auth.verifyOtp({ token_hash: tokenHash, type })
        .then(({ error: verifyError }) => {
          if (verifyError) {
            setErrorMsg(verifyError.message);
            setStatus('error');
          } else {
            setStatus('success');
            // Auto-redirect to marketplace after 3 seconds
            setTimeout(() => router.push('/marketplace'), 3000);
          }
        })
        .catch(() => {
          setErrorMsg('Greška pri verifikaciji. Pokušajte ponovo.');
          setStatus('error');
        });
    } else {
      // No token — came here after callback redirect
      setStatus('success');
      setTimeout(() => router.push('/marketplace'), 3000);
    }
  }, [searchParams, router]);

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '26px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
          </Link>
        </div>

        {status === 'loading' && (
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '40px 32px', border: '1px solid #252629' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Potvrda u toku...</h1>
            <p style={{ color: '#888', fontSize: '14px' }}>Molimo sačekajte dok verifikujemo vaš nalog.</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '40px 32px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Email potvrđen!</h1>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
              Vaš nalog je uspešno aktiviran. Automatski ćete biti preusmereni na marketplace.
            </p>
            <Link href="/marketplace" style={{ display: 'inline-block', background: '#f9372c', color: '#fff', padding: '13px 36px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Pretrazi delove →
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ background: '#1a1b1f', borderRadius: '16px', padding: '40px 32px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Greška pri potvrdi</h1>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
              {errorMsg || 'Link za potvrdu je istekao ili je nevažeći.'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/auth/signup" style={{ display: 'inline-block', background: '#f9372c', color: '#fff', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                Registrujte se ponovo
              </Link>
              <Link href="/auth/login" style={{ display: 'inline-block', background: '#333', color: '#fff', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                Prijava
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
        Učitavanje...
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
