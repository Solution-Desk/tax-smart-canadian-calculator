import { Crown, ArrowRight } from 'lucide-react'

interface UpgradePromptProps {
  feature: string
  description?: string
  onUpgrade?: () => void
}

export function UpgradePrompt({ feature, description, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Crown className="h-5 w-5 text-amber-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            {feature} requires Pro
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            {description || `Upgrade to Pro to unlock ${feature.toLowerCase()} and more premium features.`}
          </p>
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-amber-800 hover:text-amber-900 transition-colors"
          >
            Upgrade to Pro
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

interface FeatureGateProps {
  feature: string
  description?: string
  enabled: boolean
  children: React.ReactNode
  onUpgrade?: () => void
}

export function FeatureGate({ feature, description, enabled, children, onUpgrade }: FeatureGateProps) {
  if (enabled) {
    return <>{children}</>
  }

  return <UpgradePrompt feature={feature} description={description} onUpgrade={onUpgrade} />
}
