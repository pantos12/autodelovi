'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // The callback route handles the actual token exchange
    // This page is just for showing a branded confirmation message
    const error = searchParams.get('error');
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  }, [searchParams]);

  return (
    <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>AutoDelovi<span style={{ color: '#f9372c' }}>.sale</span></span>
        </div>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Potvrda u toku...</h1>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Email potvrđen!</h1>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Vaš nalog je uspešno aktiviran. Sada možete da pretražujete i kupujete auto delove.
            </p>
            <Link href="/marketplace" style={{ display: 'inline-block', background: '#f9372c', color: '#fff', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Pretrazi delove
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Greška pri potvrdi</h1>
            <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
              Link za potvrdu je istekao ili je nevažeći. Pokušajte ponovo.
            </p>
            <Link href="/auth/signup" style={{ display: 'inline-block', background: '#f9372c', color: '#fff', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Registrujte se ponovo
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>Učitavanje...</div>}>
      <ConfirmContent />
    </Suspense>
  );
}
