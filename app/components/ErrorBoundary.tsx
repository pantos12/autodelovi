'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
      if (this.props.fallback) return this.props.fallback;
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚠</p>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
            Došlo je do greške
          </h2>
          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '16px' }}>
            {this.state.error?.message || 'Neočekivana greška'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '10px 24px',
              background: '#f9372c',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Pokušaj ponovo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
