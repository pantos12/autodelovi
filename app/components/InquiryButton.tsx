'use client';
import { useState } from 'react';
import type { Part } from '@/lib/types';
import InquiryModal from './InquiryModal';

interface Props {
  part: Part;
  merchantId?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export default function InquiryButton({ part, merchantId, className, style, label }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        style={{
          width: '100%',
          padding: '12px',
          background: '#f9372c',
          border: 'none',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: 'inherit',
          ...style,
        }}
      >
        {label || 'Pošalji upit'}
      </button>
      <InquiryModal
        part={part}
        merchantId={merchantId}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
