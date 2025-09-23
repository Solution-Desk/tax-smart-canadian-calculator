/// <reference types="vite/client" />

// Extend the existing ImportMetaEnv interface
declare module 'vite' {
  interface ImportMetaEnv {
    // Your custom environment variables
    readonly VITE_BASE_URL: string;
    readonly VITE_ADSENSE_CLIENT_ID?: string;
    readonly VITE_ADSENSE_SLOT_INLINE?: string;
    readonly VITE_STRIPE_PAYMENT_LINK?: string;
  }
}

// This empty export makes this file a module
export {};
