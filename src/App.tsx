import { lazy, Suspense } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';
import TaxSmartCalculator from './components/TaxSmartCalculator';
import { Footer } from './components/Footer';
import { ConsentBanner } from './components/ConsentBanner';
import { PremiumActivator } from './components/PremiumActivator';
import ProLayout from './components/ProLayout';
import InstallPrompt from './components/InstallPrompt';
import IOSHint from './components/IOSHint';
import { useDarkMode } from './hooks/useDarkMode';

const Privacy = lazy(() => import('./pages/Privacy'));
const Pro = lazy(() => import('./pages/Pro'));
const References = lazy(() => import('./pages/References'));
const Sponsor = lazy(() => import('./pages/Sponsor'));
const Premium = lazy(() => import('./pages/Premium'));
const ProSuccess = lazy(() => import('./pages/ProSuccess'));
const ProCancel = lazy(() => import('./pages/ProCancel'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center">
      <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
      <p className="text-gray-600 dark:text-gray-300">Loading…</p>
    </div>
  </div>
);

const ErrorFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
    <div className="text-center max-w-md">
      <div className="text-red-500 text-5xl mb-4">⚠️</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        We&apos;re sorry, but the calculator encountered an error. Please refresh the page or contact
        support if the issue persists.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        type="button"
      >
        Refresh page
      </button>
    </div>
  </div>
);

const NotFound = ({ onNavigateHome }: { onNavigateHome: () => void }) => (
  <div className="container mx-auto p-6">
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-md max-w-xl">
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Page not found</h3>
      <p className="mt-2 text-sm text-red-700 dark:text-red-300">
        The page you are looking for doesn&apos;t exist or has moved.
      </p>
      <button
        onClick={onNavigateHome}
        className="mt-4 inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
        type="button"
      >
        Return to the calculator
      </button>
    </div>
  </div>
);

export default function App() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useDarkMode();
  const isDark = theme === 'dark';

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <div className={`min-h-screen flex flex-col ${isDark ? 'dark' : ''}`}>
        <PremiumActivator>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <TaxSmartCalculator />
                  </ProLayout>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <Privacy onToggleTheme={toggleTheme} />
                  </ProLayout>
                }
              />
              <Route
                path="/pro"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <Pro onToggleTheme={toggleTheme} />
                  </ProLayout>
                }
              />
              <Route
                path="/pro/success"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <ProSuccess />
                  </ProLayout>
                }
              />
              <Route
                path="/pro/cancel"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <ProCancel />
                  </ProLayout>
                }
              />
              <Route
                path="/references"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <References onToggleTheme={toggleTheme} />
                  </ProLayout>
                }
              />
              <Route
                path="/sponsor"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <Sponsor onToggleTheme={toggleTheme} />
                  </ProLayout>
                }
              />
              <Route
                path="/premium"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <Premium />
                  </ProLayout>
                }
              />
              <Route
                path="*"
                element={
                  <ProLayout onToggleTheme={toggleTheme}>
                    <NotFound onNavigateHome={() => navigate('/')} />
                  </ProLayout>
                }
              />
            </Routes>
          </Suspense>
        </PremiumActivator>
        <Footer />
        <ConsentBanner />
        <InstallPrompt />
        <IOSHint />
      </div>
    </ErrorBoundary>
  );
}
