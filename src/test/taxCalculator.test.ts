import { describe, it, expect } from 'vitest'
import { calculateLine, calculateTotals, aggregate, ZERO_BREAKDOWN } from '../lib/taxCalculator'
import type { LineItemInput } from '../lib/taxCalculator'

describe('Tax Calculator', () => {
  describe('calculateLine', () => {
    it('should calculate GST-only for Alberta standard items', () => {
      const item: LineItemInput = { amount: 100, category: 'Standard' }
      const result = calculateLine(item, 'AB')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBeCloseTo(5, 10) // 5% GST
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBeCloseTo(5, 10)
      expect(result.grandTotal).toBeCloseTo(105, 10)
    })

    it('should calculate HST for Ontario standard items', () => {
      const item: LineItemInput = { amount: 100, category: 'Standard' }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBe(0)
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBeCloseTo(13, 10) // 13% HST
      expect(result.totalTax).toBeCloseTo(13, 10)
      expect(result.grandTotal).toBeCloseTo(113, 10)
    })

    it('should calculate GST+PST for BC standard items', () => {
      const item: LineItemInput = { amount: 100, category: 'Standard' }
      const result = calculateLine(item, 'BC')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBeCloseTo(5, 10) // 5% GST
      expect(result.provincialTax).toBeCloseTo(7, 10) // 7% PST
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBeCloseTo(12, 10)
      expect(result.grandTotal).toBeCloseTo(112, 10)
    })

    it('should handle exempt items correctly', () => {
      const item: LineItemInput = { amount: 100, category: 'Exempt' }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBe(0)
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBe(0)
      expect(result.grandTotal).toBeCloseTo(100, 10)
    })

    it('should handle zero-rated basic groceries', () => {
      const item: LineItemInput = { amount: 100, category: 'Zero-rated (basic groceries)' }
      const result = calculateLine(item, 'BC')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBe(0)
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBe(0)
      expect(result.grandTotal).toBeCloseTo(100, 10)
    })

    it('should apply children\'s clothing exemption in Ontario', () => {
      const item: LineItemInput = { amount: 100, category: "Children's clothing & footwear" }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBeCloseTo(100, 10)
      expect(result.federalTax).toBeCloseTo(5, 10) // GST only, no provincial
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBeCloseTo(5, 10)
      expect(result.grandTotal).toBeCloseTo(105, 10)
    })

    it('should handle restaurant meals under $4 in Ontario', () => {
      const item: LineItemInput = { amount: 3.50, category: 'Prepared food / restaurant' }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBeCloseTo(3.50, 2)
      expect(result.federalTax).toBeCloseTo(0.175, 3) // GST only
      expect(result.provincialTax).toBe(0)
      expect(result.hstTax).toBe(0)
      expect(result.totalTax).toBeCloseTo(0.175, 3)
      expect(result.grandTotal).toBeCloseTo(3.675, 3)
    })

    it('should handle negative amounts by treating them as zero', () => {
      const item: LineItemInput = { amount: -50, category: 'Standard' }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBe(0)
      expect(result.totalTax).toBe(0)
      expect(result.grandTotal).toBe(0)
    })

    it('should handle NaN amounts by treating them as zero', () => {
      const item: LineItemInput = { amount: NaN, category: 'Standard' }
      const result = calculateLine(item, 'ON')
      
      expect(result.amount).toBe(0)
      expect(result.totalTax).toBe(0)
      expect(result.grandTotal).toBe(0)
    })
  })

  describe('aggregate', () => {
    it('should aggregate multiple line items correctly', () => {
      const lines = [
        { amount: 100, federalTax: 5, provincialTax: 7, hstTax: 0, totalTax: 12, grandTotal: 112 },
        { amount: 50, federalTax: 2.5, provincialTax: 3.5, hstTax: 0, totalTax: 6, grandTotal: 56 },
        { amount: 25, federalTax: 0, provincialTax: 0, hstTax: 0, totalTax: 0, grandTotal: 25 },
      ]
      
      const result = aggregate(lines)
      
      expect(result.subTotal).toBeCloseTo(175, 10)
      expect(result.federal).toBeCloseTo(7.5, 10)
      expect(result.provincial).toBeCloseTo(10.5, 10)
      expect(result.hst).toBe(0)
      expect(result.tax).toBeCloseTo(18, 10)
      expect(result.grandTotal).toBeCloseTo(193, 10)
    })

    it('should handle empty array', () => {
      const result = aggregate([])
      
      expect(result.subTotal).toBe(0)
      expect(result.federal).toBe(0)
      expect(result.provincial).toBe(0)
      expect(result.hst).toBe(0)
      expect(result.tax).toBe(0)
      expect(result.grandTotal).toBe(0)
    })
  })

  describe('calculateTotals', () => {
    it('should calculate totals for mixed items in BC', () => {
      const items: LineItemInput[] = [
        { amount: 100, category: 'Standard' },
        { amount: 50, category: 'Zero-rated (basic groceries)' },
        { amount: 25, category: "Children's clothing & footwear" },
      ]
      
      const result = calculateTotals(items, 'BC')
      
      expect(result.lines).toHaveLength(3)
      expect(result.totals.subTotal).toBe(175)
      // Standard: 5 GST + 7 PST = 12
      // Groceries: 0
      // Children's clothing in BC: 5% GST only (PST exempt) = 1.25
      expect(result.totals.tax).toBeCloseTo(13.25, 2)
      expect(result.totals.grandTotal).toBeCloseTo(188.25, 2)
    })

    it('should handle Quebec QST calculation', () => {
      const items: LineItemInput[] = [
        { amount: 100, category: 'Standard' },
      ]
      
      const result = calculateTotals(items, 'QC')
      
      expect(result.lines).toHaveLength(1)
      expect(result.totals.subTotal).toBe(100)
      expect(result.totals.federal).toBe(5) // 5% GST
      expect(result.totals.provincial).toBeCloseTo(9.975) // 9.975% QST
      expect(result.totals.tax).toBeCloseTo(14.975)
      expect(result.totals.grandTotal).toBeCloseTo(114.975)
    })
  })
})
