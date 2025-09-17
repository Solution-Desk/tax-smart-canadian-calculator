import React from 'react';
import StripeBuyButtons from '../components/StripeBuyButtons';

export default function BillingPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-900 text-white">
      <StripeBuyButtons
        monthly={{
          buyButtonId: import.meta.env.VITE_STRIPE_MONTHLY_BUTTON_ID || '',
          publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
          link: import.meta.env.VITE_STRIPE_MONTHLY_LINK || '#',
        }}
        yearly={{
          buyButtonId: import.meta.env.VITE_STRIPE_YEARLY_BUTTON_ID || '',
          publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
          link: import.meta.env.VITE_STRIPE_YEARLY_LINK || '#',
        }}
      />
    </main>
  );
}
