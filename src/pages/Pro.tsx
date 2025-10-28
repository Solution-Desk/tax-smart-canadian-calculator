import React from 'react';
import { PageLayout } from '../components/PageLayout';

const Pro: React.FC<{ onToggleTheme: () => void }> = ({ onToggleTheme }) => {
  return (
    <PageLayout 
      title="Go Premium" 
      onToggleTheme={onToggleTheme}
      description="Unlock premium features and support development"
    >
      <div className="content">
        <section className="section premium-features">
          <h2>Premium Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Ad-Free Experience</h3>
              <p>Use the calculator without any advertisements.</p>
            </div>
            <div className="feature-card">
              <h3>Advanced Categories</h3>
              <p>Access additional tax categories for more accurate calculations.</p>
            </div>
            <div className="feature-card">
              <h3>Save & Share</h3>
              <p>Save your calculations and share them with others.</p>
            </div>
            <div className="feature-card">
              <h3>Priority Support</h3>
              <p>Get help quickly with priority email support.</p>
            </div>
          </div>
        </section>

        <section className="section pricing-section">
          <h2>Choose Your Plan</h2>
          <div className="pricing-cards">
            <div className="pricing-card">
              <h3>Monthly</h3>
              <div className="price">$2.99<span>/month</span></div>
              <button className="btn primary">Subscribe</button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Best Value</div>
              <h3>Yearly</h3>
              <div className="price">$29.99<span>/year</span></div>
              <p className="savings">Save 16%</p>
              <button className="btn primary">Subscribe</button>
            </div>
          </div>
        </section>

        <section className="section faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes, you can cancel your subscription at any time through your account settings.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a free trial?</h3>
            <p>Yes, we offer a 7-day free trial for all new subscribers.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards and PayPal.</p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Pro;
