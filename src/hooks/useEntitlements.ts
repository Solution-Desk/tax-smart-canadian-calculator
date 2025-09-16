import { useUser } from '@clerk/clerk-react'
import { useMemo } from 'react'
import { getEntitlements, type Entitlements, type Plan } from '../lib/entitlements'

export function useEntitlements(): Entitlements {
  const { user } = useUser()
  
  const plan: Plan = useMemo(() => {
    // Check if user has pro subscription in their metadata
    // This would be set by webhook when subscription is created/updated
    const userPlan = user?.publicMetadata?.plan as Plan
    return userPlan === 'pro' ? 'pro' : 'free'
  }, [user?.publicMetadata?.plan])

  return getEntitlements(plan)
}

export function useCanAddLineItem(currentCount: number): boolean {
  const entitlements = useEntitlements()
  return currentCount < entitlements.maxLineItems
}

export function usePlanStatus() {
  const { user, isSignedIn } = useUser()
  const entitlements = useEntitlements()
  
  return {
    isSignedIn,
    plan: entitlements.plan,
    isPro: entitlements.plan === 'pro',
    isFree: entitlements.plan === 'free',
    entitlements,
  }
}
