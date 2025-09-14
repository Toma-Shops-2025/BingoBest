import React from 'react';

interface AppFallbackProps {
  error?: Error;
  onRetry?: () => void;
}

const AppFallback: React.FC<AppFallbackProps> = ({ error, onRetry }) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #fdf2f8 50%, #dbeafe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '1.5rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            margin: '0 auto 1rem',
            width: '4rem',
            height: '4rem',
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '2rem', color: '#dc2626' }}>⚠️</span>
          </div>
          <h1 style={{ fontSize: '1.25rem', color: '#dc2626', marginBottom: '1rem' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            We're sorry, but something unexpected happened. Don't worry, your progress is saved!
          </p>
          
          {error && process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '1rem', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', fontSize: '0.875rem', color: '#6b7280' }}>
                Error Details (Development)
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                backgroundColor: '#f3f4f6',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                overflow: 'auto'
              }}>
                {error.toString()}
              </pre>
            </details>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={handleRetry}
              style={{
                width: '100%',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🔄 Reload Page
            </button>
            <button
              onClick={handleGoHome}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🏠 Go Home
            </button>
          </div>
          
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem' }}>
            <p>If this problem persists, please:</p>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
              <li>Check your internet connection</li>
              <li>Clear your browser cache</li>
              <li>Try using a different browser</li>
              <li>Contact support if the issue continues</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFallback;
