import React from 'react';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  
  // This ensures we're on the client side before rendering Clerk components
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted, render a simple loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
