import React from 'react';
import { isPro } from '../lib/flags';
import { startCheckout } from '../lib/pay';

interface GateProps {
  children: React.ReactNode;
  feature?: string;
}

export default function Gate({ children, feature }: GateProps) {
  if (isPro()) {
    return <>{children}</>;
  }

  return (
    <div className="pro-wall">
      <div className="pro-content">
        <h3>Unlock Pro Features</h3>
        <p>Upgrade to Pro to {feature || 'access this feature'} and more:</p>
        <ul className="pro-features">
          <li>✓ Save unlimited receipts</li>
          <li>✓ Export to CSV</li>
          <li>✓ Create shareable links</li>
          <li>✓ Priority support</li>
        </ul>
        <button
          className="btn-primary"
          onClick={() => startCheckout().catch((error) => console.error('Checkout failed', error))}
          style={{ marginTop: '1rem' }}
          type="button"
        >
          Go Pro
        </button>
      </div>
    </div>
  );
}

// Styled in index.css
// .pro-wall { ... }
