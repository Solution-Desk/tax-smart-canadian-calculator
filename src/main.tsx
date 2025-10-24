import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

// Get the base URL from the environment or use root
const getBaseUrl = () => {
  // If we're in development or have a VITE_BASE_URL, use that
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL;
  }
  
  // For GitHub Pages, use the repository name as base path
  if (import.meta.env.PROD && window.location.hostname === 'solution-desk.github.io') {
    return '/tax-smart-canadian-calculator';
  }
  
  // Default to root
  return '/';
};

const baseUrl = getBaseUrl();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Remove loading element if it exists
const loadingElement = document.querySelector('.loading');
if (loadingElement?.parentNode) {
  loadingElement.parentNode.removeChild(loadingElement);
}

// Ensure base URL ends with a single slash
const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={normalizedBaseUrl}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
