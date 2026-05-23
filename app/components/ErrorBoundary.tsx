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
      return this.props.fallback ?? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>&#x26A0;&#xFE0F;</p>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
            Nesto je poslo po zlu
          </h2>
          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
            Doslo je do greske pri ucitavanju stranice.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
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
            Pokusaj ponovo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
