import React, { useEffect, useState } from 'react'
import { useConsent } from '../hooks/useConsent'
import { Link } from 'react-router-dom'
import { X, Cookie } from 'lucide-react'

export function ConsentBanner() {
  const { consented, accept } = useConsent()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    if (!consented) {
      // Small delay to allow page to render first
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [consented])

  if (consented || !isVisible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 transition-transform duration-300 transform ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center flex-1 min-w-0">
            <span className="flex p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Cookie className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
            </span>
            <p className="ml-3 text-sm text-gray-700 dark:text-gray-200">
              We use cookies to provide an ad-supported free experience. By clicking Accept, you agree
              to our{' '}
              <Link 
                to="/privacy" 
                className="font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>.
            </p>
          </div>
          <div className="mt-2 flex-shrink-0 w-full sm:mt-0 sm:w-auto">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={accept}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Dismiss"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
