import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Footer } from './components/Footer';
import ErrorBoundary from './ErrorBoundary';
import TaxSmartCalculator from './components/TaxSmartCalculator/TaxSmartCalculator';
import { Routes, Route, useLocation } from 'react-router-dom';
import Privacy from './pages/Privacy';
import Premium from './pages/Premium';
import { ConsentBanner } from './components/ConsentBanner';
import { PremiumActivator } from './components/PremiumActivator';
import { Loader2 } from 'lucide-react';
import ProLayout from './components/ProLayout';

// Lazy load Pro pages
const ProSuccess = lazy(() => import('./pages/ProSuccess'));
const ProCancel = lazy(() => import('./pages/ProCancel'));

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

// Loading component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading calculator...</p>
    </div>
  </div>
);

// App component with loading state
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Show error boundary fallback if error occurs
  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      {isLoading ? (
        <LoadingFallback />
      ) : (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
          <main className="flex-grow">
            <PremiumActivator>
              <Routes>
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/premium" element={<Premium />} />
                <Route path="/premium/activate" element={<PremiumActivator />} />
                
                {/* Pro Routes */}
                <Route path="/pro/success" element={
                  <ProLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProSuccess />
                    </Suspense>
                  </ProLayout>
                } />
                
                <Route path="/pro/cancel" element={
                  <ProLayout>
                    <Suspense fallback={<LoadingFallback />}>
                      <ProCancel />
                    </Suspense>
                  </ProLayout>
                } />
                
                {/* 404 - Not Found */}
                <Route path="*" element={
                  <div className="container mx-auto p-4">
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                      <div className="flex">
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Page not found</h3>
                          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>The page you're looking for doesn't exist or has been moved.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <TaxSmartCalculator />
                  </div>
                } />
                
                {/* Default route */}
                <Route path="/" element={<TaxSmartCalculator />} />
              </Routes>
            </PremiumActivator>
          </main>
          <Footer />
          <ConsentBanner />
        </div>
      )}
    </ErrorBoundary>
  );
}
