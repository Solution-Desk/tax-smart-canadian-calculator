/**
 * Environment configuration with type safety and defaults
 */

export const env = {
  // Stripe
  STRIPE_PK: import.meta.env.VITE_STRIPE_PK || '',
  STRIPE_PRICE_ID: import.meta.env.VITE_STRIPE_PRICE_ID || '',
  
  // Environment
  NODE_ENV: import.meta.env.MODE,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;

export const hasStripe = !!(env.STRIPE_PK && env.STRIPE_PRICE_ID);

// Validate required environment variables in production
if (import.meta.env.PROD) {
  const requiredVars = ['VITE_STRIPE_PK', 'VITE_STRIPE_PRICE_ID'] as const;
  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    // Don't throw in production to avoid breaking the app
    // Just log the error and continue with limited functionality
  }
}
