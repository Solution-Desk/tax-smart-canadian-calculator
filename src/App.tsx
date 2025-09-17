import React, { Suspense } from 'react';
import { AuthWrapper } from './components/AuthWrapper';
import { Footer } from './components/Footer';

// Lazy load the calculator to improve initial load time
const TaxSmartCalculator = React.lazy(() => import('./components/TaxSmartCalculator/TaxSmartCalculator'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-300">Loading calculator...</p>
    </div>
  </div>
);

// Error boundary for the calculator
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in calculator:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
          <div className="max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We're having trouble loading the calculator. Please refresh the page to try again.
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
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <div className="app-container">
      <AuthWrapper>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <main className="main-content">
              <TaxSmartCalculator />
            </main>
            <Footer />
          </Suspense>
        </ErrorBoundary>
      </AuthWrapper>
    </div>
  );
}
