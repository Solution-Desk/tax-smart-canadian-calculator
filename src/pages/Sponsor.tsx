import React from 'react';
import { PageLayout } from '../components/PageLayout';

const Sponsor: React.FC<{ onToggleTheme: () => void }> = ({ onToggleTheme }) => {
  return (
    <PageLayout 
      title="Support TaxSmart" 
      onToggleTheme={onToggleTheme}
      description="Help keep TaxSmart free and ad-free for everyone"
    >
      <div className="content">
        <section className="section">
          <h2>Why Support TaxSmart?</h2>
          <p>
            TaxSmart is a free, open-source project built to help Canadians understand and calculate taxes.
            Your support helps cover hosting costs, development time, and keeps the app ad-free for everyone.
          </p>
        </section>

        <section className="section">
          <h2>Ways to Support</h2>
          <div className="support-options">
            <div className="support-option">
              <h3>Become a Sponsor</h3>
              <p>Make a one-time or recurring donation to support ongoing development.</p>
              <a href="https://github.com/sponsors/your-username" target="_blank" rel="noopener noreferrer" className="btn primary">
                Sponsor on GitHub
              </a>
            </div>
            <div className="support-option">
              <h3>Upgrade to Premium</h3>
              <p>Get an ad-free experience with additional premium features.</p>
              <a href="/pro" className="btn primary">
                Go Premium
              </a>
            </div>
            <div className="support-option">
              <h3>Contribute Code</h3>
              <p>Help improve TaxSmart by contributing to the open-source project.</p>
              <a href="https://github.com/your-username/tax-smart-canadian-calculator" target="_blank" rel="noopener noreferrer" className="btn secondary">
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Our Supporters</h2>
          <p className="thank-you">
            Thank you to all our amazing supporters who help keep TaxSmart free and accessible to everyone!
          </p>
          <div className="supporters-grid">
            {/* Add supporter logos or names here */}
            <div className="supporter">Be the first to support us!</div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Sponsor;
