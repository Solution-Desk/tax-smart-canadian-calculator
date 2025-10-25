import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

// Use empty basename by default - let Vite handle the base URL
const baseUrl = '';

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
