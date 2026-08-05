'use client';
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontSize: '48px' }}>&#x26A0;&#xFE0F;</p>
          <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: 0 }}>Nesto je poslo naopako</h2>
          <p style={{ color: '#aaa', fontSize: '14px', margin: 0, maxWidth: '400px', textAlign: 'center' }}>
            Doslo je do greske. Pokusajte da osvezite stranicu.
          </p>
          <button
            onClick={() => this.setState({ error: null })}
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
