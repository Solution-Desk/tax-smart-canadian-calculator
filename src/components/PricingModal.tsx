import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { X, Check, Crown, Zap } from 'lucide-react'
import { openCheckout, STRIPE_PRICE_IDS } from '../lib/billing'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleUpgrade = async (variantId: string) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      openCheckout(variantId, user.id, user.primaryEmailAddress?.emailAddress || '')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upgrade to Pro
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Free
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  $0
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Up to 5 line items
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Single province calculations
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Public share links (24h)
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    All tax categories
                  </span>
                </li>
              </ul>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Current Plan
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-amber-500 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-amber-500" />
                  Pro
                </h3>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  $9
                  <span className="text-sm font-normal text-gray-500">/month</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  or $90/year (save 17%)
                </div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Unlimited</strong> line items
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Multi-province</strong> comparison
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>CSV & PDF</strong> export
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Private</strong> share links
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Saved</strong> calculations
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <strong>Priority</strong> support
                  </span>
                </li>
              </ul>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleUpgrade(STRIPE_PRICE_IDS.PRO_MONTHLY)}
                  disabled={isLoading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Upgrade Monthly'}
                </button>
                <button
                  onClick={() => handleUpgrade(STRIPE_PRICE_IDS.PRO_YEARLY)}
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Upgrade Yearly (Save 17%)'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}
