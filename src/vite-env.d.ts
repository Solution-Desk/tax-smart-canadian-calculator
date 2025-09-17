/// <reference types="vite/client" />

// This is a workaround for Vite's environment variables in TypeScript
declare global {
  // Extend the existing ImportMeta interface
  interface ImportMetaEnv {
    // Your custom environment variables
    VITE_APP_CLERK_PUBLISHABLE_KEY: string;
    VITE_LEMON_SQUEEZY_STORE_ID: string;
    VITE_BASE_URL: string;
  }

  // Extend the existing ImportMeta interface
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// This empty export makes this file a module
export {};
