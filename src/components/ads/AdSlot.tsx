import React, { useEffect, useRef } from 'react'
import { usePremium } from '../../hooks/usePremium'
import { Capacitor } from '@capacitor/core'
import { useConsent } from '../../hooks/useConsent'

interface AdSlotProps {
  slot: string
  className?: string
  style?: React.CSSProperties
}

export function AdSlot({ slot, className, style }: AdSlotProps) {
  const { isPremium } = usePremium()
  const insRef = useRef<HTMLModElement | null>(null)
  const { consented } = useConsent()

  const client = import.meta.env.VITE_ADSENSE_CLIENT_ID as string | undefined
  const isNative = Capacitor?.isNativePlatform?.() ?? false
  const shouldRender = !isPremium && consented && !isNative && !!client && !!slot

  useEffect(() => {
    if (!shouldRender) return

    // Load AdSense script once
    const existing = document.querySelector('script[data-adsbygoogle-script="true"]') as HTMLScriptElement | null
    if (!existing) {
      const s = document.createElement('script')
      s.setAttribute('data-adsbygoogle-script', 'true')
      s.async = true
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client!)}`
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }

    // Try to (re)render the ad when the script is ready
    const pushAd = () => {
      try {
        // Guard against duplicate pushes on the same ins element
        const el = insRef.current as any
        if (el && !el.getAttribute('data-adsbygoogle-status')) {
          ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({})
        }
      } catch (e) {
        // no-op
      }
    }

    // If the script already exists, try immediately; otherwise wait a tick
    if (existing) {
      pushAd()
    } else {
      const id = window.setTimeout(pushAd, 400)
      return () => window.clearTimeout(id)
    }
  }, [shouldRender, client, consented])

  if (!shouldRender) {
    return null
  }

  const isLocal = typeof window !== 'undefined' && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname)

  return (
    <div className={['ad-container', className].filter(Boolean).join(' ')} style={style}>
      <ins
        ref={insRef as any}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        {...(isLocal ? { 'data-adtest': 'on' } : {})}
      />
    </div>
  )
}
