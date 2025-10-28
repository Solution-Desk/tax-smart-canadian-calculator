/**
 * Feature flags and Pro functionality
 */

export const isPro = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('taxsmart_pro') === '1';
};

export const setPro = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('taxsmart_pro', enabled ? '1' : '0');};

export const proFeatures = {
  exportCSV: true,
  saveReceipts: true,
  multiReceipts: true,
  shareShortLink: true,
  prioritySupport: true,
  advancedAnalytics: true
} as const;

export type ProFeature = keyof typeof proFeatures;
