'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              marginBottom: '16px',
            }}
          >
            &#x26A0;&#xFE0F;
          </div>
          <h2
            style={{
              color: '#fff',
              fontSize: '22px',
              fontWeight: 700,
              marginBottom: '8px',
            }}
          >
            Došlo je do greške
          </h2>
          <p
            style={{
              color: '#888',
              fontSize: '14px',
              marginBottom: '24px',
              maxWidth: '400px',
            }}
          >
            Nešto nije u redu. Molimo osvežite stranicu ili se vratite na
            početnu.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: '#f9372c',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Osveži stranicu
            </button>
            <a
              href="/"
              style={{
                padding: '10px 24px',
                background: '#252629',
                border: '1px solid #333',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              Početna
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
