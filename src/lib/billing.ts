const LEMON_SQUEEZY_STORE_ID = import.meta.env.VITE_LEMON_SQUEEZY_STORE_ID

export interface CheckoutOptions {
  variantId: string
  userId: string
  email: string
  customData?: Record<string, any>
}

export function createCheckoutUrl(options: CheckoutOptions): string {
  const params = new URLSearchParams({
    'checkout[product_options][enabled_variants][]': options.variantId,
    'checkout[custom][user_id]': options.userId,
    'checkout[email]': options.email,
    'checkout[custom_data]': JSON.stringify(options.customData || {}),
  })

  return `https://${LEMON_SQUEEZY_STORE_ID}.lemonsqueezy.com/checkout/buy/${options.variantId}?${params.toString()}`
}

export const LEMON_SQUEEZY_VARIANTS = {
  PRO_MONTHLY: 'your_monthly_variant_id',
  PRO_YEARLY: 'your_yearly_variant_id',
} as const

export function openCheckout(variantId: string, userId: string, email: string) {
  const checkoutUrl = createCheckoutUrl({
    variantId,
    userId,
    email,
    customData: {
      plan: variantId === LEMON_SQUEEZY_VARIANTS.PRO_YEARLY ? 'pro_yearly' : 'pro_monthly',
      source: 'canada-tax-calc'
    }
  })
  
  window.open(checkoutUrl, '_blank')
}
