export type Plan = 'free' | 'pro'

export interface Entitlements {
  plan: Plan
  maxLineItems: number
  canExport: boolean
  canSaveCalculations: boolean
  canUsePrivateShares: boolean
  canCompareProvinces: boolean
  shareExpiryHours: number
}

export const FREE_ENTITLEMENTS: Entitlements = {
  plan: 'free',
  maxLineItems: 5,
  canExport: false,
  canSaveCalculations: false,
  canUsePrivateShares: false,
  canCompareProvinces: false,
  shareExpiryHours: 24,
}

export const PRO_ENTITLEMENTS: Entitlements = {
  plan: 'pro',
  maxLineItems: Infinity,
  canExport: true,
  canSaveCalculations: true,
  canUsePrivateShares: true,
  canCompareProvinces: true,
  shareExpiryHours: 24 * 30, // 30 days
}

export function getEntitlements(plan: Plan): Entitlements {
  return plan === 'pro' ? PRO_ENTITLEMENTS : FREE_ENTITLEMENTS
}

export function canAddLineItem(currentCount: number, entitlements: Entitlements): boolean {
  return currentCount < entitlements.maxLineItems
}

export function getUpgradeMessage(feature: string): string {
  return `${feature} is available with Pro. Upgrade to unlock unlimited calculations, exports, and more!`
}
