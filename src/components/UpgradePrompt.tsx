import { Crown, ArrowRight } from 'lucide-react'

interface UpgradePromptProps {
  feature: string
  description?: string
  onUpgrade?: () => void
}

export function UpgradePrompt({ feature, description, onUpgrade }: UpgradePromptProps) {
  return (
    <div className="upgrade-prompt" style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Crown aria-hidden className="h-4 w-4" />
        <strong style={{ fontSize: 14 }}>{feature} requires Pro</strong>
      </div>
      <p className="muted" style={{ marginTop: 6 }}>
        {description || `Upgrade to Pro to unlock ${feature.toLowerCase()} and more premium features.`}
      </p>
      <button onClick={onUpgrade} className="btn" style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        Upgrade to Pro
        <ArrowRight aria-hidden className="h-3 w-3" />
      </button>
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
