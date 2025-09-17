import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './ErrorBoundary';
import './index.css';

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const baseUrl = import.meta.env.VITE_BASE_URL || '/';

// Log environment info for debugging
console.log('Environment:', import.meta.env.MODE);
console.log('Base URL:', baseUrl);
console.log('Clerk Key Present:', Boolean(clerkKey));
console.log('Stripe Key Present:', Boolean(stripeKey));

async function bootstrap() {
  // Remove loading state once app is loaded
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const loadingElement = document.querySelector('.loading');
    if (loadingElement?.parentNode) {
      loadingElement.parentNode.removeChild(loadingElement);
    }
  }

  let tree = (
    <ErrorBoundary>
      <BrowserRouter basename={baseUrl}>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  );

  // Only load Stripe if the key is present
  if (stripeKey) {
    try {
      const [{ Elements }, { loadStripe }] = await Promise.all([
        import('@stripe/react-stripe-js'),
        import('@stripe/stripe-js'),
      ]);
      const stripePromise = loadStripe(stripeKey);
      tree = <Elements stripe={stripePromise}>{tree}</Elements>;
    } catch (error) {
      console.error('Failed to load Stripe:', error);
    }
  } else {
    console.warn('Stripe publishable key is not set. Skipping Elements provider.');
  }

  // Only load Clerk if the key is present
  if (clerkKey) {
    try {
      const { ClerkProvider } = await import('@clerk/clerk-react');
      tree = (
        <ClerkProvider 
          publishableKey={clerkKey}
          afterSignInUrl="/"
          afterSignUpUrl="/"
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
        >
          {tree}
        </ClerkProvider>
      );
    } catch (error) {
      console.error('Failed to load Clerk:', error);
    }
  } else {
    console.warn('Clerk publishable key is not set. Skipping auth provider.');
  }

  // Render the app
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      {tree}
    </React.StrictMode>
  );
}

// Start the application
bootstrap().catch(error => {
  console.error('Failed to bootstrap application:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 2rem; font-family: system-ui; text-align: center;">
        <h1>Failed to load the application</h1>
        <p>Please refresh the page or try again later.</p>
        <pre style="text-align: left; background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto;">
          ${error?.message || 'Unknown error'}
        </pre>
      </div>
    `;
  }
});
