import { describe, it, expect } from 'vitest';
import { calculateTax, calculateTotal, reverseTax } from './taxMath';

describe('taxMath', () => {
  describe('calculateTax', () => {
    it('should calculate tax for Ontario (13% HST)', () => {
      expect(calculateTax(100, 'ON')).toBe(13);
      expect(calculateTax(50, 'ON')).toBe(6.5);
      expect(calculateTax(0, 'ON')).toBe(0);
    });

    it('should calculate tax for Alberta (5% GST)', () => {
      expect(calculateTax(100, 'AB')).toBe(5);
      expect(calculateTax(50, 'AB')).toBe(2.5);
    });

    it('should handle zero amount', () => {
      expect(calculateTax(0, 'ON')).toBe(0);
      expect(calculateTax(0, 'AB')).toBe(0);
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total with tax for Ontario', () => {
      expect(calculateTotal(100, 'ON')).toBe(113);
      expect(calculateTotal(50, 'ON')).toBe(56.5);
    });

    it('should calculate total with tax for Alberta', () => {
      expect(calculateTotal(100, 'AB')).toBe(105);
      expect(calculateTotal(50, 'AB')).toBe(52.5);
    });

    it('should handle zero amount', () => {
      expect(calculateTotal(0, 'ON')).toBe(0);
      expect(calculateTotal(0, 'AB')).toBe(0);
    });
  });

  describe('reverseTax', () => {
    it('should calculate pre-tax amount for Ontario', () => {
      expect(reverseTax(113, 'ON')).toBeCloseTo(100, 2);
      expect(reverseTax(56.5, 'ON')).toBeCloseTo(50, 2);
    });

    it('should calculate pre-tax amount for Alberta', () => {
      expect(reverseTax(105, 'AB')).toBeCloseTo(100, 2);
      expect(reverseTax(52.5, 'AB')).toBeCloseTo(50, 2);
    });

    it('should handle zero amount', () => {
      expect(reverseTax(0, 'ON')).toBe(0);
      expect(reverseTax(0, 'AB')).toBe(0);
    });
  });

  // Edge cases
  it('should handle very small amounts', () => {
    expect(calculateTax(0.01, 'ON')).toBeCloseTo(0.0013, 4);
    expect(calculateTotal(0.01, 'ON')).toBeCloseTo(0.0113, 4);
    expect(reverseTax(0.0113, 'ON')).toBeCloseTo(0.01, 2);
  });

  it('should handle large amounts', () => {
    const largeAmount = 1_000_000;
    expect(calculateTax(largeAmount, 'ON')).toBeCloseTo(largeAmount * 0.13, 2);
    expect(calculateTotal(largeAmount, 'ON')).toBeCloseTo(largeAmount * 1.13, 2);
    expect(reverseTax(largeAmount * 1.13, 'ON')).toBeCloseTo(largeAmount, 2);
  });
});
