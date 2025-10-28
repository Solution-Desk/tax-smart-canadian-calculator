import { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, Moon, Sun } from 'lucide-react';
import { Footer } from './components/Footer';
import ErrorBoundary from './ErrorBoundary';
import { TaxSmartCalculator } from './components/TaxSmartCalculator/TaxSmartCalculator';
import { useDarkMode } from './hooks/useDarkMode';
import { ConsentBanner } from './components/ConsentBanner';
import { PremiumActivator } from './components/PremiumActivator';
import ProLayout from './components/ProLayout';
import InstallPrompt from './components/InstallPrompt';
import IOSHint from './components/IOSHint';

type ProLayoutProps = {
  children: React.ReactNode;
  onToggleTheme?: () => void;
};

// Lazy load pages
const Privacy = lazy(() => import('./pages/Privacy'));
const Pro = lazy(() => import('./pages/Pro'));
const References = lazy(() => import('./pages/References'));
const Sponsor = lazy(() => import('./pages/Sponsor'));
const Premium = lazy(() => import('./pages/Premium'));
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

// Theme toggle button component
const ThemeToggle = ({ isDark, toggleTheme }: { isDark: boolean; toggleTheme: () => void }) => (
  <button
    onClick={toggleTheme}
    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

// App component with loading state
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

  // Wrap with useCallback to prevent unnecessary re-renders
  const handleToggleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  // Create a layout component that includes the ProLayout and theme toggle
  const Layout = useCallback(({ children }: { children: React.ReactNode }) => (
    <ProLayout onToggleTheme={handleToggleTheme}>
      {children}
    </ProLayout>
  ), [handleToggleTheme]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, []);

  // Show error boundary fallback if error occurs
  if (hasError) {
    return <ErrorFallback />;
  }

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {isLoading ? (
        <LoadingFallback />
      ) : (
        <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
          <div className="flex-grow">
            <PremiumActivator>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={
                    <Layout>
                      <TaxSmartCalculator />
                    </Layout>
                  } />
                  <Route path="/privacy" element={
                    <Layout>
                      <Privacy />
                    </Layout>
                  } />
                  <Route path="/pro" element={
                    <Layout>
                      <Pro />
                    </Layout>
                  } />
                  <Route path="/pro/success" element={
                    <Layout>
                      <ProSuccess />
                    </Layout>
                  } />
                  <Route path="/pro/cancel" element={
                    <Layout>
                      <ProCancel />
                    </Layout>
                  } />
                  <Route path="/references" element={
                    <Layout>
                      <References />
                    </Layout>
                  } />
                  <Route path="/sponsor" element={
                    <Layout>
                      <Sponsor />
                    </Layout>
                  } />
                  <Route path="/premium" element={
                    <Layout>
                      <Premium />
                    </Layout>
                  } />
                  {/* 404 - Not Found */}
                  <Route path="*" element={
                    <Layout>
                      <div className="container mx-auto p-4">
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
                          <div className="flex">
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Page not found</h3>
                              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <p>The page you're looking for doesn't exist or has been moved.</p>
                              </div>
                              <button 
                                onClick={() => navigate('/')}
                                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                              >
                                Return to calculator
                              </button>
                            </div>
                          </div>
                        </div>
                        <TaxSmartCalculator />
                      </div>
                    </Layout>
                  } />
                </Routes>
              </Suspense>
            </PremiumActivator>
          </div>
          <Footer />
          <ConsentBanner />
          <InstallPrompt />
          <IOSHint />
        </div>
      )}
    </ErrorBoundary>
  );
}
