'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ background: '#0c0d0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px' }}>
          <span style={{ fontSize: '64px' }}>⚠️</span>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>Nešto je pošlo naopako</h1>
          <p style={{ color: '#aaa', fontSize: '14px', margin: 0, textAlign: 'center', maxWidth: '400px' }}>
            Došlo je do greške. Pokušajte da osvežite stranicu.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            style={{ marginTop: '12px', padding: '12px 32px', background: '#f9372c', borderRadius: '8px', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
          >
            Osveži stranicu
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
