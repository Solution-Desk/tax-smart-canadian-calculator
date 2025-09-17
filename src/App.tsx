import React from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { Footer } from './components/Footer';
import ErrorBoundary from './ErrorBoundary';
import TaxSmartCalculator from './components/TaxSmartCalculator/TaxSmartCalculator';

// Error fallback component
const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We're sorry, but the calculator encountered an error. Please try refreshing the page or contact support if the issue persists.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export default function App() {
  return (
    <div className="app-container">
      <AuthWrapper>
        <ErrorBoundary fallback={<ErrorFallback />}>
          <main className="main-content">
            <TaxSmartCalculator />
          </main>
          <Footer />
        </ErrorBoundary>
      </AuthWrapper>
    </div>
  );
}
