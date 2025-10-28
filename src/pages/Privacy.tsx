import React from 'react';
import { PageLayout } from '../components/PageLayout';

const Privacy: React.FC<{ onToggleTheme: () => void }> = ({ onToggleTheme }) => {
  return (
    <PageLayout 
      title="Privacy Policy" 
      onToggleTheme={onToggleTheme}
      description="How we handle your data"
    >
      <div className="content">
        <section className="section">
          <p className="last-updated">Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>Overview</h2>
          <p>
            TaxSmart is a free, ad-supported calculator. We respect your privacy and collect only the
            minimum data necessary to operate the app and measure basic usage.
          </p>
        </section>

        <section className="section">
          <h2>Data We Process</h2>
          <ul className="privacy-list">
            <li>Preferences you set in the app (e.g., province, theme, consent, premium) are stored on your device using localStorage.</li>
            <li>Advertising networks may process data to serve and measure ads. See their privacy policies for details.</li>
            <li>We do not sell your personal information.</li>
          </ul>
        </section>

        <section className="section">
          <h2>Advertising</h2>
          <p>
            We use Google AdSense to provide an ad-supported free experience. You can remove ads by upgrading to Premium.
          </p>
        </section>

        <section className="section">
          <h2>Contact</h2>
          <p>
            Questions? Email us at{' '}
            <a href="mailto:taxapp@thesolutiondesk.ca" className="email-link">
              taxapp@thesolutiondesk.ca
            </a>.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default Privacy;
