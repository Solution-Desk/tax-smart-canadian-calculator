import React, { useCallback } from 'react'
import { usePremium } from '../hooks/usePremium'

export default function Premium() {
  const { isPremium, enable, disable } = usePremium()
  const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined

  const handleUpgrade = useCallback(() => {
    if (paymentLink) {
      window.open(paymentLink, '_blank', 'noopener')
      return
    }
    enable()
  }, [paymentLink, enable])

  const handleRestore = useCallback(() => {
    // Simple restore: if user returns with ?premium=1 anywhere, PremiumActivator enables it.
    // This button is just a helper in case a user needs a manual enable in development.
    enable()
  }, [enable])

  return (
    <div className="panel" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 className="panel-title">Premium</h1>
      <p className="panel-subtitle">Ad-free experience and future premium features</p>

      <div style={{ marginTop: 16 }}>
        <p>Status: <strong>{isPremium ? 'Enabled' : 'Not enabled'}</strong></p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        {!isPremium && (
          <button className="btn primary" onClick={handleUpgrade}>Go Premium</button>
        )}
        {isPremium && (
          <button className="btn" onClick={disable}>Disable Premium</button>
        )}
        {!isPremium && (
          <button className="btn ghost" onClick={handleRestore}>Restore (dev)</button>
        )}
      </div>

      <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>
        After purchase, you should be redirected back here with Premium enabled. If not, use Restore or contact support.
      </p>
    </div>
  )
}
