import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { X, Check, Crown, Heart, Minus } from 'lucide-react'
import { openCheckout, STRIPE_PRICE_IDS } from '../lib/billing'

interface PricingModalProps {
  isOpen: boolean
  onClose: () => void
}

type PlanId = 'free' | 'pro' | 'supporter'

type PlanAction =
  | { type: 'button'; label: string; onClick: () => void; variant: 'primary' | 'secondary' | 'ghost'; disabled?: boolean }
  | { type: 'link'; label: string; href: string; variant: 'primary' | 'secondary' }

type PlanCard = {
  id: PlanId
  name: string
  badge?: string
  price: string
  cadence: string
  tagline: string
  icon?: JSX.Element
  highlight?: boolean
  actions: PlanAction[]
  footnote?: string
}

type FeatureRow = {
  key: string
  label: string
  helper?: string
  availability: Record<PlanId, boolean>
}

const SPONSOR_URL = 'https://github.com/sponsors/Solution-Desk'
const SPONSOR_IFRAME_PROPS = {
  src: 'https://github.com/sponsors/Solution-Desk/button',
  title: 'Sponsor Solution-Desk',
  height: 32,
  width: 114,
}

const FEATURE_MATRIX: FeatureRow[] = [
  {
    key: 'calculations',
    label: 'Unlimited calculations',
    helper: 'Run as many quotes as you need without throttling.',
    availability: { free: true, pro: true, supporter: true },
  },
  {
    key: 'shares',
    label: 'Share link & copy results',
    helper: 'Send colleagues a snapshot or paste totals into invoices.',
    availability: { free: true, pro: true, supporter: true },
  },
  {
    key: 'references',
    label: 'CRA & provincial reference library',
    availability: { free: true, pro: true, supporter: true },
  },
  {
    key: 'presets',
    label: 'Saved presets & projects',
    helper: 'Organise favourite configurations per client.',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'line-items',
    label: 'Unlimited line items',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'exports',
    label: 'CSV & PDF export',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'batch',
    label: 'Batch import (CSV)',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'currency',
    label: 'Multi-currency display',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'audit',
    label: 'Audit notes (rule triggers)',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'share-expiry',
    label: 'Private share links (30 days)',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'support',
    label: 'Priority email support',
    availability: { free: false, pro: true, supporter: true },
  },
  {
    key: 'previews',
    label: 'Early feature previews & release shout-out',
    availability: { free: false, pro: false, supporter: true },
  },
]

export function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { user } = useUser()
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const isSignedIn = Boolean(user)

  const handleUpgrade = async (variantId: string) => {
    if (!user) {
      return
    }

    setIsLoading(true)
    try {
      openCheckout(variantId, user.id, user.primaryEmailAddress?.emailAddress || '')
    } finally {
      setIsLoading(false)
    }
  }

  const planCards: PlanCard[] = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      cadence: '/month',
      tagline: 'Essentials stay free forever for quick, accurate quotes.',
      actions: [
        {
          type: 'button',
          label: 'Included with every account',
          onClick: () => undefined,
          variant: 'ghost',
          disabled: true,
        },
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      badge: 'Best value',
      icon: <Crown className="h-5 w-5 text-amber-500" aria-hidden />,
      price: 'CA$19.99',
      cadence: '/year',
      tagline: 'Unlock exports, unlimited presets, and batch tools — priced between free apps and suites.',
      highlight: true,
      actions: [
        {
          type: 'button',
          label: isLoading ? 'Loading…' : 'Upgrade yearly — CA$19.99',
          onClick: () => handleUpgrade(STRIPE_PRICE_IDS.PRO_YEARLY),
          variant: 'primary',
          disabled: isLoading || !isSignedIn,
        },
        {
          type: 'button',
          label: isLoading ? 'Loading…' : 'Upgrade monthly — CA$3.49',
          onClick: () => handleUpgrade(STRIPE_PRICE_IDS.PRO_MONTHLY),
          variant: 'secondary',
          disabled: isLoading || !isSignedIn,
        },
      ],
      footnote: !isSignedIn ? 'Sign in to continue checkout.' : undefined,
    },
    {
      id: 'supporter',
      name: 'Supporter',
      icon: <Heart className="h-5 w-5 text-rose-500" aria-hidden />,
      price: 'CA$24.99',
      cadence: '/year',
      tagline: 'Same features as Pro plus helps fund the free essentials.',
      actions: [
        {
          type: 'link',
          label: 'Sponsor on GitHub',
          href: SPONSOR_URL,
          variant: 'primary',
        },
      ],
    },
  ]

  const actionBaseClasses =
    'w-full font-medium py-2 px-4 rounded-md transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400'

  const actionClassMap: Record<PlanAction['variant'], string> = {
    primary: `${actionBaseClasses} bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50`,
    secondary: `${actionBaseClasses} border border-amber-500 text-amber-500 hover:bg-amber-500/10 disabled:opacity-50`,
    ghost: `${actionBaseClasses} bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 cursor-default`,
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Unlock TaxSmart Pro
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close pricing dialog"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm md:text-base">
            TaxSmart stays free for core quoting. Upgrading keeps the lights on and unlocks the extras teams ask for most.
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-xs md:text-sm">
            Pro is CA$19.99/year (or CA$3.49/month). Supporter at CA$24.99/year has the same features and helps fund the free essentials. It positions us above simple freebies and below heavy business suites — with room for promos like “Founding year CA$14.99”.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            {planCards.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-lg border p-6 ${
                  plan.highlight
                    ? 'border-amber-500 bg-amber-50/10 dark:bg-amber-500/5'
                    : plan.id === 'supporter'
                    ? 'border-rose-300 dark:border-rose-500 bg-rose-50/10 dark:bg-rose-500/5'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.badge && (
                  <div className="flex justify-center">
                    <span className="mb-4 inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-6 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                    {plan.icon}
                    <span>{plan.name}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-500">{plan.cadence}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.tagline}</p>
                </div>

                <div className="space-y-3">
                  {plan.actions.map((action, index) => {
                    if (action.type === 'link') {
                      return (
                        <a
                          key={action.label}
                          href={action.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`${actionClassMap[action.variant]} inline-flex items-center justify-center`}
                        >
                          {action.label}
                        </a>
                      )
                    }

                    return (
                      <button
                        key={action.label}
                        type="button"
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`${actionClassMap[action.variant]} inline-flex items-center justify-center`}
                      >
                        {action.label}
                      </button>
                    )
                  })}
                </div>

                {plan.id === 'supporter' && (
                  <div className="mt-4 flex justify-center">
                    <iframe
                      className="rounded sponsor-iframe"
                      {...SPONSOR_IFRAME_PROPS}
                      style={{ border: 0, borderRadius: '6px' }}
                    />
                  </div>
                )}

                {plan.footnote && (
                  <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">{plan.footnote}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Feature comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 dark:bg-gray-900/40 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Feature</th>
                    {planCards.map((plan) => (
                      <th key={plan.id} className="py-3 px-4 text-center font-semibold">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {FEATURE_MATRIX.map((row) => (
                    <tr key={row.key} className="bg-white dark:bg-gray-800">
                      <td className="py-3 px-4 align-top text-gray-700 dark:text-gray-200">
                        <div>{row.label}</div>
                        {row.helper && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{row.helper}</div>
                        )}
                      </td>
                      {planCards.map((plan) => {
                        const available = row.availability[plan.id]
                        return (
                          <td key={plan.id} className="py-3 px-4 text-center" title={available ? 'Included' : 'Not included'}>
                            {available ? (
                              <Check className="mx-auto h-5 w-5 text-emerald-500" aria-hidden />
                            ) : (
                              <Minus className="mx-auto h-5 w-5 text-gray-400" aria-hidden />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 space-y-2">
            <p>✓ Cancel anytime • ✓ 30-day money-back guarantee • ✓ Secure checkout</p>
            <p>
              Questions about pricing? Email{' '}
              <a className="underline" href="mailto:taxapp@thesolutiondesk.ca">
                taxapp@thesolutiondesk.ca
              </a>.
            </p>
            <div className="flex justify-center">
              <iframe
                className="rounded sponsor-iframe"
                {...SPONSOR_IFRAME_PROPS}
                style={{ border: 0, borderRadius: '6px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
