'use client';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  show: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

let nextId = 0;

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = ++nextId;
    setToasts(prev => [...prev.slice(-2), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.message) show(detail.message, detail.type || 'success');
    };
    window.addEventListener('toast:show', handler);
    return () => window.removeEventListener('toast:show', handler);
  }, [show]);

  const colors = {
    success: { bg: 'rgba(34,197,94,0.15)', border: '#22c55e', text: '#22c55e' },
    error: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', text: '#ef4444' },
    info: { bg: 'rgba(59,130,246,0.15)', border: '#3b82f6', text: '#3b82f6' },
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none' }}>
        {toasts.map(t => {
          const c = colors[t.type];
          return (
            <div
              key={t.id}
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: '10px',
                padding: '12px 20px',
                color: c.text,
                fontSize: '14px',
                fontWeight: 600,
                backdropFilter: 'blur(12px)',
                animation: 'toast-in 0.25s ease-out',
                pointerEvents: 'auto',
              }}
            >
              {t.message}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}
