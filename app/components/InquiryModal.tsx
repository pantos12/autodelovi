'use client';
import { useEffect, useState } from 'react';
import type { Part } from '@/lib/types';

interface Props {
  part: Part;
  merchantId?: string;
  open: boolean;
  onClose: () => void;
}

export default function InquiryModal({ part, merchantId, open, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset on open/close
  useEffect(() => {
    if (open) {
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  // Auto-close on success
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => {
      onClose();
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSuccess(false);
    }, 2000);
    return () => clearTimeout(t);
  }, [success, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Email je obavezan.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          part_id: part?.id,
          merchant_id: merchantId ?? part?.supplier_id,
          buyer_name: name.trim() || undefined,
          buyer_email: email.trim(),
          buyer_phone: phone.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json?.error) {
        throw new Error(json?.error || `Greška (${res.status})`);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setSubmitting(false);
    }
  }

  const labelStyle: React.CSSProperties = { color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px', fontWeight: 500 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#0c0d0f', border: '1px solid #2a2b2f', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '16px',
        fontFamily: 'Inter, "Helvetica Neue", sans-serif',
      }}
    >
      <style>{`
        .inquiry-modal input:focus, .inquiry-modal textarea:focus { border-color: #f9372c !important; }
      `}</style>
      <div
        className="inquiry-modal"
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth: '460px', background: '#1a1b1f',
          border: '1px solid #2a2b2f', borderRadius: '12px', padding: '24px',
          position: 'relative',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori"
          style={{
            position: 'absolute', top: '12px', right: '12px',
            background: 'transparent', border: 'none', color: '#aaa',
            fontSize: '20px', cursor: 'pointer', lineHeight: 1, padding: '4px 8px',
          }}
        >×</button>

        <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '0 0 6px', paddingRight: '28px' }}>
          Pošalji upit
        </h2>
        {part?.name ? (
          <p style={{ color: '#888', fontSize: '12px', margin: '0 0 18px' }}>
            {part.name}
          </p>
        ) : null}

        {success ? (
          <div style={{
            background: 'rgba(34, 197, 94, 0.12)', border: '1px solid #22c55e',
            borderRadius: '8px', padding: '14px 16px', color: '#22c55e', fontSize: '13px',
            textAlign: 'center',
          }}>
            Poslali smo vaš upit — javićemo se u najkraćem roku
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)', border: '1px solid #ef4444',
                borderRadius: '8px', padding: '10px 12px', color: '#ef4444',
                fontSize: '13px', marginBottom: '14px',
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Ime i prezime</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Email *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Telefon</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Poruka</label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '90px' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%', padding: '12px', background: submitting ? '#6b6b6b' : '#f9372c',
                border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px',
                fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Šalje se...' : 'Pošalji upit'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
