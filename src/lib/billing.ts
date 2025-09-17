import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
  console.warn('Stripe publishable key is not set. Please add VITE_STRIPE_PUBLISHABLE_KEY to your .env file');
}

export const STRIPE_PLANS = {
  PRO_MONTHLY: 'pro_monthly',
  PRO_YEARLY: 'pro_yearly',
} as const;

export const STRIPE_PRICE_IDS = {
  PRO_MONTHLY: 'price_1S8LcGC8Z2peWf8UabP3FePl', // tazsmart pro monthly
  PRO_YEARLY: 'price_1S8LZbC8Z2peWf8Uk1yKWvyt',  // tazsmart pro yearly
} as const;

export async function openCheckout(planId: string, userId: string, email: string) {
  if (!stripePromise) {
    console.error('Stripe failed to initialize');
    return;
  }

  try {
    // Create a checkout session on the server
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: planId,
        userId,
        email,
        successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    const session = await response.json();

    if (session.error) {
      console.error('Error creating checkout session:', session.error);
      return;
    }

    // When the customer clicks on the button, redirect them to Checkout.
    const stripe = await stripePromise;
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
      }
    } else {
      console.error('Stripe failed to initialize');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
