import React, { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

// Register service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New content available. Reload?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root
const root = createRoot(rootElement);

// Render app with error boundary and suspense
root.render(
  <StrictMode>
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<LoadingFallback />}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
);

// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '300px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '1.25rem',
          marginBottom: '1rem',
          color: '#334155'
        }}>
          Loading TaxSmart...
        </div>
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e2e8f0',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0ea5e9',
            animation: 'loading 1.5s ease-in-out infinite'
          }} />
        </div>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '1rem',
      textAlign: 'center',
      backgroundColor: '#f8fafc',
      color: '#1e293b'
    }}>
      <h1 style={{
        fontSize: '1.875rem',
        fontWeight: '700',
        marginBottom: '1rem',
        color: '#0f172a'
      }}>
        Something went wrong
      </h1>
      <p style={{
        fontSize: '1.125rem',
        marginBottom: '2rem',
        maxWidth: '32rem'
      }}>
        We're sorry, but we encountered an unexpected error. Our team has been notified.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: '#0ea5e9',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0284c7')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
      >
        Reload Page
      </button>
      <p style={{
        marginTop: '2rem',
        fontSize: '0.875rem',
        color: '#64748b'
      }}>
        If the problem persists, please contact support
      </p>
    </div>
  );
}

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes loading {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

// Log build info
console.log(
  `%cTaxSmart %cv${import.meta.env.VITE_APP_VERSION || '1.0.0'}%c\n${import.meta.env.VITE_BUILD_DATE || ''}`,
  'color: #0ea5e9; font-size: 1.5em; font-weight: bold',
  'color: #64748b; font-size: 0.9em;',
  'color: #94a3b8; font-size: 0.8em;'
      <BrowserRouter basename={normalizedBaseUrl}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
