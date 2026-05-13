'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
        this.props.fallback ?? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px', padding: '24px' }}>
            <p style={{ fontSize: '36px' }}>&#x26A0;&#xFE0F;</p>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>Nesto nije u redu</h2>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Doslo je do greske. Pokusajte ponovo.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{ padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              Pokusaj ponovo
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
