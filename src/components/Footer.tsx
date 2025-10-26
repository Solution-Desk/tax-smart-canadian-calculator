import React from 'react';
import { VersionBadge } from './VersionBadge';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Disclaimer */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 mb-6 rounded-r">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Disclaimer:</strong> This tool provides estimates only and does not constitute tax or financial advice. 
                Tax rules change and may vary by item. Rates current as of January 2025. Please verify with official sources.
              </p>
            </div>
          </div>
        </div>

        {/* Footer content */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link to="/premium" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Upgrade to Pro
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              &copy; {currentYear} TaxSmart Calculator. All rights reserved.<br />
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Version: <VersionBadge />
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
