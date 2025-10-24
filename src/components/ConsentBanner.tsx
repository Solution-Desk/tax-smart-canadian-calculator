import React from 'react'
import { useConsent } from '../hooks/useConsent'
import { Link } from 'react-router-dom'

export function ConsentBanner() {
  const { consented, accept } = useConsent()
  if (consented) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="consent-banner"
    >
      <div className="consent-content">
        <p>
          We use cookies to provide an ad-supported free experience. By clicking Accept, you agree
          to the use of cookies. See our <Link to="/privacy">Privacy Policy</Link> to learn more.
        </p>
        <div className="consent-actions">
          <button type="button" className="btn primary" onClick={accept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
