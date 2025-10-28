import { Stripe, loadStripe } from '@stripe/stripe-js';
import { hasStripe, env } from './env';

type CheckoutError = Error & { code?: string; message: string };

// Type for the Stripe instance with redirectToCheckout
type StripeWithCheckout = Stripe & {
  redirectToCheckout: (options: {
    lineItems: Array<{ price: string; quantity: number }>;
    mode: 'subscription' | 'payment';
    successUrl: string;
    cancelUrl: string;
    customerEmail?: string;
    billingAddressCollection?: 'required' | 'auto';
  }) => Promise<{ error?: { message?: string } }>;
};

let stripePromise: Promise<StripeWithCheckout | null>;

/**
 * Initialize Stripe and start the checkout process
 * @param email Optional customer email to pre-fill in the checkout form
 * @throws {Error} If Stripe is not configured or if there's an error during checkout
 */
export async function startCheckout(email?: string): Promise<void> {
  if (!hasStripe) {
    console.error('Stripe is not configured. Check your environment variables.');
    throw new Error('Payment processing is not available at this time.');
  }

  try {
    // Load Stripe.js asynchronously only when needed
    if (!stripePromise) {
      stripePromise = loadStripe(env.STRIPE_PK) as Promise<StripeWithCheckout | null>;
    }

    const stripe = await stripePromise;
    
    if (!stripe) {
      throw new Error('Failed to initialize payment processor');
    }

    const baseUrl = window.location.origin;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ 
        price: env.STRIPE_PRICE_ID, 
        quantity: 1 
      }],
      mode: 'subscription',
      successUrl: `${baseUrl}/pro/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${baseUrl}/pro/cancel`,
      customerEmail: email,
      billingAddressCollection: 'required',
    });

    if (error) {
      throw new Error(error.message || 'Failed to process payment');
    }
  } catch (err) {
    const error = err as CheckoutError;
    console.error('Checkout error:', error);
    
    // Provide user-friendly error messages
    let message = 'An error occurred during checkout. Please try again.';
    
    if (error.code === 'STRIPE_NOT_CONFIGURED') {
      message = 'Payment processing is not properly configured.';
    } else if (error.code?.startsWith('stripe_')) {
      message = 'Payment service error. Please try again later.';
    } else if (error.message?.includes('Failed to load')) {
      message = 'Unable to connect to payment processor. Please check your internet connection.';
    }
    
    throw new Error(message);
  }
}

/**
 * Format a price in cents to a localized currency string
 * @param amount Amount in cents
 * @param currency Currency code (default: 'USD')
 * @returns Formatted price string (e.g., "$9.99")
 */
/**
 * Format a price in cents to a localized currency string
 * @param amount Amount in cents
 * @param currency Currency code (default: 'USD')
 * @returns Formatted price string (e.g., "$9.99")
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

/**
 * Check if the current user has an active subscription
 * This would typically check your backend or Stripe Customer Portal
 */
export async function checkSubscriptionStatus(): Promise<boolean> {
  // Implementation would depend on your backend API
  // This is a placeholder that assumes a simple localStorage check
  if (typeof window !== 'undefined') {
    return localStorage.getItem('taxsmart_subscription_status') === 'active';
  }
  return false;
}
export function formatBillingInterval(interval: 'day' | 'week' | 'month' | 'year'): string {
  return {
    day: 'day',
    week: 'week',
    month: 'month',
    year: 'year',
  }[interval] || '';
}
