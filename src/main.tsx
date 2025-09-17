import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from './ClerkProvider';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

// Remove loading state once app is loaded
const rootElement = document.getElementById('root');
if (rootElement) {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement && loadingElement.parentNode) {
    loadingElement.parentNode.removeChild(loadingElement);
  }
}

// Get the base URL from environment variables or use root
const baseUrl = import.meta.env.VITE_BASE_URL || '/';

// Log environment info for debugging
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', baseUrl);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);

const AppWithProviders = () => (
  <React.StrictMode>
    <ErrorBoundary
      fallback={
        <div className="error">
          <h2>Failed to load the application</h2>
          <p>Please refresh the page or try again later.</p>
        </div>
      }
    >
      <BrowserRouter basename={baseUrl}>
        <ClerkProvider>
          <App />
        </ClerkProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

root.render(<AppWithProviders />);
