/// <reference types="vite/client" />

// Extend the existing ImportMetaEnv interface
declare module 'vite' {
  interface ImportMetaEnv {
    // Your custom environment variables
    readonly VITE_CLERK_PUBLISHABLE_KEY: string;
    readonly VITE_BASE_URL: string;
    readonly VITE_LEMON_SQUEEZY_STORE_ID?: string;
  }
}

// This empty export makes this file a module
export {};
