import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

// Remove loading state once app is loaded
const rootElement = document.getElementById('root');
if (rootElement) {
  const loadingElement = document.querySelector('.loading');
  if (loadingElement?.parentNode) {
    loadingElement.parentNode.removeChild(loadingElement);
  }
}

// Get the base URL from environment variables or use root
const baseUrl = import.meta.env.VITE_BASE_URL || '/';
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Log environment info for debugging
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', baseUrl);
console.log('Clerk Key Present:', !!publishableKey);

if (!publishableKey) {
  console.error('Missing Clerk Publishable Key. Please check your .env file');
}

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
        <ClerkProvider 
          publishableKey={publishableKey}
          afterSignInUrl="/"
          afterSignUpUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          <App />
        </ClerkProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);

root.render(<AppWithProviders />);
