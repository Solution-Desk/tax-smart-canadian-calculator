import React from 'react';
import { VersionBadge } from './VersionBadge';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-text-group">
            <p className="footer-text">
              &copy; {currentYear} TaxSmart Calculator. All rights reserved.
            </p>
            <p className="footer-updated">
              Tax rates updated: <time dateTime="2025-01-01">January 1, 2025</time>
            </p>
          </div>
          <p className="footer-disclaimer">
            This tool is for informational purposes only and should not be considered tax advice.
            Verify all calculations with official tax authorities.
          </p>
        </div>
        <div className="footer-version">
          <VersionBadge />
        </div>
      </div>
    </footer>
  );
}
