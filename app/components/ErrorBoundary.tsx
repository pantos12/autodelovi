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
        <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px', fontFamily: 'Inter, "Helvetica Neue", sans-serif' }}>
          <span style={{ fontSize: '48px' }}>&#9888;&#65039;</span>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>Doslo je do greske</h2>
          <p style={{ color: '#aaa', fontSize: '14px', margin: 0 }}>Nesto nije u redu. Pokusajte ponovo.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ marginTop: '8px', padding: '10px 24px', background: '#f9372c', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
          >
            Pokusaj ponovo
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
