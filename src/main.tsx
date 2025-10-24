import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

const baseUrl = import.meta.env.VITE_BASE_URL || '/';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const loadingElement = document.querySelector('.loading');
if (loadingElement?.parentNode) {
  loadingElement.parentNode.removeChild(loadingElement);
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
