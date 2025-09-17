import React, { useEffect, useState } from 'react';
import { loadStripeBuyButton } from '../lib/loadStripeBuyButton';

type Props = {
  monthly: {
    buyButtonId: string;
    publishableKey: string;
    link: string; // fallback Payment Link
  };
  yearly: {
    buyButtonId: string;
    publishableKey: string;
    link: string; // fallback Payment Link
  };
};

export default function StripeBuyButtons({ monthly, yearly }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStripeBuyButton()
      .then(() => setReady(true))
      .catch((e) => setError(e?.message ?? 'Failed to load Stripe'));
  }, []);

  return (
    <section className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">Upgrade to TaxSmart Pro</h2>
      <p className="text-center text-gray-500 mb-6">Pick a plan that works for you.</p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
          Couldn't load the Stripe widget. You can still purchase using the direct checkout links below.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-medium mb-2">Monthly</h3>
          {ready && !error ? (
            // Web Component registered by the script
            // @ts-ignore – TypeScript doesn't know the custom element
            <stripe-buy-button
              buy-button-id={monthly.buyButtonId}
              publishable-key={monthly.publishableKey}
            />
          ) : (
            <a
              className="inline-block mt-2 rounded-xl px-4 py-2 border border-white/20 hover:bg-white/10"
              href={monthly.link}
              target="_blank"
              rel="noreferrer"
            >
              Open Monthly Checkout
            </a>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 p-5">
          <h3 className="text-xl font-medium mb-2">Yearly</h3>
          {ready && !error ? (
            // @ts-ignore
            <stripe-buy-button
              buy-button-id={yearly.buyButtonId}
              publishable-key={yearly.publishableKey}
            />
          ) : (
            <a
              className="inline-block mt-2 rounded-xl px-4 py-2 border border-white/20 hover:bg:white/10"
              href={yearly.link}
              target="_blank"
              rel="noreferrer"
            >
              Open Yearly Checkout
            </a>
          )}
        </div>
      </div>

      <p className="text-xs text-center text-gray-500 mt-6">
        Having trouble with the widget? The buttons above will open secure Stripe Checkout.
      </p>
    </section>
  );
}
