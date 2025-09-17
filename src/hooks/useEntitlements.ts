import { useMemo } from 'react';
import { getEntitlements, type Entitlements, type Plan } from '../lib/entitlements';

// Safe version of useUser that won't throw when Clerk isn't available
function useSafeUser() {
  try {
    // Use dynamic import to avoid loading Clerk unless needed
    const { useUser } = require('@clerk/clerk-react');
    return useUser();
  } catch (error) {
    // Clerk not available or not initialized
    console.warn('Clerk not available, using fallback user state');
    return { user: null, isSignedIn: false };
  }
}

export function useEntitlements(): Entitlements {
  const { user } = useSafeUser();
  
  const plan: Plan = useMemo(() => {
    // If no user or Clerk not available, default to free plan
    if (!user) return 'free';
    
    // Check if user has pro subscription in their metadata
    // This would be set by webhook when subscription is created/updated
    const userPlan = user.publicMetadata?.plan as Plan;
    return userPlan === 'pro' ? 'pro' : 'free';
  }, [user?.publicMetadata?.plan]);

  return getEntitlements(plan);
}

export function useCanAddLineItem(currentCount: number): boolean {
  const entitlements = useEntitlements();
  return currentCount < entitlements.maxLineItems;
}

export function usePlanStatus() {
  const { user, isSignedIn: clerkIsSignedIn } = useSafeUser();
  const entitlements = useEntitlements();
  
  // If Clerk isn't available, treat as not signed in but still provide plan info
  const isSignedIn = user ? clerkIsSignedIn : false;
  
  return {
    isSignedIn,
    plan: entitlements.plan,
    isPro: entitlements.plan === 'pro',
    isFree: entitlements.plan === 'free',
    entitlements,
  }
}
