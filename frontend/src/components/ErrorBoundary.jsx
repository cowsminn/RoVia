import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 24,
          fontFamily: 'Arial, sans-serif',
          color: '#111827',
          background: '#fff7ed',
          minHeight: '100vh'
        }}>
          <h2 style={{ marginTop: 0, color: '#b45309' }}>A intervenit o eroare</h2>
          <p style={{ color: '#92400e' }}>{this.state.error?.toString()}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
            {this.state.info?.componentStack || this.state.error?.stack}
          </details>
          <div style={{ marginTop: 20 }}>
            <button onClick={() => window.location.reload()} style={{ padding: '8px 12px', borderRadius: 6, background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer' }}>
              Reîncarcă pagina
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
