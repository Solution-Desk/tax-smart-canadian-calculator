import React from 'react';
import { ClerkProvider as ClerkProviderBase } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

// Check if Clerk publishable key is available
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// If Clerk is not configured, render children without Clerk
if (!clerkPublishableKey) {
  console.warn('Clerk publishable key is not set. Authentication features will be disabled.');
}

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  // If Clerk is not configured, render children without Clerk
  if (!clerkPublishableKey) {
    return <>{children}</>;
  }
  
  return (
    <ClerkProviderBase
      publishableKey={clerkPublishableKey}
      navigate={(to) => navigate(to)}
    >
      {children}
    </ClerkProviderBase>
  );
}
