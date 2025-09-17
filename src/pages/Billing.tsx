import React from 'react';
import StripeBuyButtons from '../components/StripeBuyButtons';

export default function BillingPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-900 text-white">
      <StripeBuyButtons
        monthly={{
          buyButtonId: 'buy_btn_1S8OSIC8Z2peWf8Ukdi8XvvS',
          publishableKey: 'pk_live_51RycmaC8Z2peWf8UJKHZEg6hCF2oWKv8znUzAgl2UdxLkTuHkkueL54BRkGg5qMmBg5gvp5DainqdIOfArJqkRsF00r1kridjS',
          link: 'https://buy.stripe.com/3cI3cubwodMD9fbcvh5AQ02',
        }}
        yearly={{
          buyButtonId: 'buy_btn_1S8ORPC8Z2peWf8Uevo9ocJN',
          publishableKey: 'pk_live_51RycmaC8Z2peWf8UJKHZEg6hCF2oWKv8znUzAgl2UdxLkTuHkkueL54BRkGg5qMmBg5gvp5DainqdIOfArJqkRsF00r1kridjS',
          link: 'https://buy.stripe.com/00weVc6c48sj1MJ7aX5AQ01',
        }}
      />
    </main>
  );
}
