import { describe, it, expect } from 'vitest'
import { getEntitlements, canAddLineItem, getUpgradeMessage, FREE_ENTITLEMENTS, PRO_ENTITLEMENTS } from '../lib/entitlements'

describe('Entitlements', () => {
  describe('getEntitlements', () => {
    it('should return free entitlements for free plan', () => {
      const entitlements = getEntitlements('free')
      expect(entitlements).toEqual(FREE_ENTITLEMENTS)
      expect(entitlements.maxLineItems).toBe(5)
      expect(entitlements.canExport).toBe(false)
      expect(entitlements.canSaveCalculations).toBe(false)
    })

    it('should return pro entitlements for pro plan', () => {
      const entitlements = getEntitlements('pro')
      expect(entitlements).toEqual(PRO_ENTITLEMENTS)
      expect(entitlements.maxLineItems).toBe(Infinity)
      expect(entitlements.canExport).toBe(true)
      expect(entitlements.canSaveCalculations).toBe(true)
    })
  })

  describe('canAddLineItem', () => {
    it('should allow adding items under free limit', () => {
      expect(canAddLineItem(3, FREE_ENTITLEMENTS)).toBe(true)
      expect(canAddLineItem(4, FREE_ENTITLEMENTS)).toBe(true)
    })

    it('should not allow adding items at free limit', () => {
      expect(canAddLineItem(5, FREE_ENTITLEMENTS)).toBe(false)
      expect(canAddLineItem(10, FREE_ENTITLEMENTS)).toBe(false)
    })

    it('should always allow adding items for pro plan', () => {
      expect(canAddLineItem(100, PRO_ENTITLEMENTS)).toBe(true)
      expect(canAddLineItem(1000, PRO_ENTITLEMENTS)).toBe(true)
    })
  })

  describe('getUpgradeMessage', () => {
    it('should return appropriate upgrade message', () => {
      const message = getUpgradeMessage('CSV Export')
      expect(message).toContain('CSV Export')
      expect(message).toContain('Pro')
      expect(message).toContain('upgrade')
    })
  })
})
