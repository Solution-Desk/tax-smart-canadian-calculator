import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

interface ProLayoutProps {
  children: React.ReactNode;
  onToggleTheme?: () => void;
}

function ProLayout({ children, onToggleTheme }: ProLayoutProps) {
  const [isDark, setIsDark] = useState(false);

  // Update dark mode state when it changes
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    updateDarkMode();
    
    // Watch for changes to the class list
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);
  return (
    <div className="pro-layout">
      <header className="pro-header">
        <div className="container flex justify-between items-center">
          <Link to="/" className="logo">
            TaxSmart <span className="pro-badge">Pro</span>
          </Link>
          {onToggleTheme !== undefined && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </header>
      <main className="pro-main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="pro-footer">
        <div className="container">
          <p>Need help? <a href="mailto:support@taxsmart.example.com">Contact support</a></p>
          <p className="small">© {new Date().getFullYear()} TaxSmart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default ProLayout;

// Add these styles to your main CSS file
/*
.pro-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.pro-header {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.pro-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--text-primary);
}

.pro-badge {
  background: var(--accent);
  color: white;
  font-size: 0.8em;
  padding: 0.2em 0.5em;
  border-radius: 4px;
  margin-left: 0.5em;
}

.pro-main {
  flex: 1;
  padding: 2rem 0;
}

.pro-footer {
  padding: 1.5rem 0;
  border-top: 1px solid var(--border);
  background: var(--surface);
  text-align: center;
}

.pro-footer p {
  margin: 0.5rem 0;
  color: var(--text-muted);
}

.pro-footer a {
  color: var(--accent);
  text-decoration: none;
}

.pro-footer a:hover {
  text-decoration: underline;
}

.small {
  font-size: 0.875rem;
}
*/
