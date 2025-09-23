import React from 'react'

export default function Privacy() {
  return (
    <div className="panel" style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1 className="panel-title">Privacy Policy</h1>
      <p className="panel-subtitle">Last updated: January 1, 2025</p>

      <section>
        <h2 style={{ marginTop: '1rem' }}>Overview</h2>
        <p>
          TaxSmart is a free, ad-supported calculator. We respect your privacy and collect only the
          minimum data necessary to operate the app and measure basic usage.
        </p>
      </section>

      <section>
        <h2 style={{ marginTop: '1rem' }}>Data we process</h2>
        <ul style={{ paddingLeft: '1.25rem' }}>
          <li>Preferences you set in the app (e.g., province, theme, consent, premium) are stored on your device using localStorage.</li>
          <li>Advertising networks may process data to serve and measure ads. See their privacy policies for details.</li>
          <li>We do not sell your personal information.</li>
        </ul>
      </section>

      <section>
        <h2 style={{ marginTop: '1rem' }}>Advertising</h2>
        <p>
          We use Google AdSense to provide an ad-supported free experience. You can remove ads by upgrading to Premium.
        </p>
      </section>

      <section>
        <h2 style={{ marginTop: '1rem' }}>Contact</h2>
        <p>
          Questions? Email us at <a href="mailto:taxapp@thesolutiondesk.ca">taxapp@thesolutiondesk.ca</a>.
        </p>
      </section>
    </div>
  )
}
