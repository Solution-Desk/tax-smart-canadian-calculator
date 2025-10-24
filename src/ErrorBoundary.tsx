import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // Log to error tracking service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  handleReset = () => {
    // Clear any service worker caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    // Unregister service workers if present
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => registration.unregister());
        });
      } catch {}
    }
    // Clear local storage if needed
    // localStorage.clear();
    
    // Force reload
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
            <div className="space-y-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-left overflow-auto">
                <pre className="text-sm">
                  {this.state.error?.message || 'Unknown error occurred'}
                </pre>
              </div>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Clear Cache & Refresh
              </button>
              <p className="text-sm text-gray-500">
                If the problem persists, please try using a private/incognito window.
              </p>
              <details className="mt-2 text-xs opacity-75">
                <summary className="cursor-pointer">View technical details</summary>
                <pre className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded overflow-auto max-h-40">
                  {this.state.error?.stack}
                </pre>
              </details>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
