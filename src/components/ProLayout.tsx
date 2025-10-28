import React from 'react';
import { Link } from 'react-router-dom';

interface ProLayoutProps {
  children: React.ReactNode;
}

export default function ProLayout({ children }: ProLayoutProps) {
  return (
    <div className="pro-layout">
      <header className="pro-header">
        <div className="container">
          <Link to="/" className="logo">
            TaxSmart <span className="pro-badge">Pro</span>
          </Link>
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
