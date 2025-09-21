/// <reference types="vite/client" />

// Extend the existing ImportMetaEnv interface
declare module 'vite' {
  interface ImportMetaEnv {
    // Your custom environment variables
    readonly VITE_BASE_URL: string;
  }
}

// This empty export makes this file a module
export {};
