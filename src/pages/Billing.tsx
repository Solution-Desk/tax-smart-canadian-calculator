import React from 'react';
import StripeBuyButtons from '../components/StripeBuyButtons';

export default function BillingPage() {
  const stripePk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Define the buy button configuration
  const buyButtonConfig = {
    monthly: {
      buyButtonId: 'buy_btn_1S8OSIC8Z2peWf8Ukdi8XvvS',
      publishableKey: 'pk_live_51RycmaC8Z2peWf8UJKHZEg6hCF2oWKv8znUzAgl2UdxLkTuHkkueL54BRkGg5qMmBg5gvp5DainqdIOfArJqkRsF00r1kridjS',
      link: 'https://buy.stripe.com/3cI3cubwodMD9fbcvh5AQ02',
    },
    yearly: {
      buyButtonId: 'buy_btn_1S8ORPC8Z2peWf8Uevo9ocJN',
      publishableKey: 'pk_live_51RycmaC8Z2peWf8UJKHZEg6hCF2oWKv8znUzAgl2UdxLkTuHkkueL54BRkGg5qMmBg5gvp5DainqdIOfArJqkRsF00r1kridjS',
      link: 'https://buy.stripe.com/00weVc6c48sj1MJ7aX5AQ01',
    },
  };

  return (
    <main className="min-h-screen p-6 bg-gray-900 text-white">
      {!stripePk ? (
        // No Stripe key → render Buy Buttons with direct configuration
        <StripeBuyButtons
          monthly={buyButtonConfig.monthly}
          yearly={buyButtonConfig.yearly}
        />
      ) : (
        // If Stripe key is present, you could use Elements/Checkout here
        // For now, we'll just use the Buy Buttons with the env vars
        <StripeBuyButtons
          monthly={{
            buyButtonId: import.meta.env.VITE_STRIPE_MONTHLY_BUTTON_ID || buyButtonConfig.monthly.buyButtonId,
            publishableKey: stripePk,
            link: import.meta.env.VITE_STRIPE_MONTHLY_LINK || buyButtonConfig.monthly.link,
          }}
          yearly={{
            buyButtonId: import.meta.env.VITE_STRIPE_YEARLY_BUTTON_ID || buyButtonConfig.yearly.buyButtonId,
            publishableKey: stripePk,
            link: import.meta.env.VITE_STRIPE_YEARLY_LINK || buyButtonConfig.yearly.link,
          }}
        />
      )}
    </main>
  );
}
