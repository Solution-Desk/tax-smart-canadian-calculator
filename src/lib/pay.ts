import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PK = import.meta.env.VITE_STRIPE_PK;
const STRIPE_PRICE_ID = import.meta.env.VITE_STRIPE_PRICE_ID;

export async function startCheckout() {
  try {
    const stripe = await loadStripe(STRIPE_PK);
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/pro/success`,
      cancelUrl: `${window.location.origin}/pro/cancel`,
    });

    if (error) {
      console.error('Stripe checkout error:', error);
      // Show error to user
      alert('Failed to start checkout. Please try again.');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    alert('An error occurred. Please try again later.');
  }
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
