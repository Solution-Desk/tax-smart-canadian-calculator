import { describe, it, expect } from 'vitest';
import { calculateTax, reverseCalculateTax, formatCurrency, getTaxRate } from './tax';

describe('Tax Calculations', () => {
  describe('calculateTax', () => {
    it('calculates tax for Ontario (13% HST)', () => {
      expect(calculateTax(100, 'ON')).toBe(13);
      expect(calculateTax(50, 'ON')).toBe(6.5);
      expect(calculateTax(0, 'ON')).toBe(0);
    });

    it('calculates tax for Alberta (5% GST)', () => {
      expect(calculateTax(100, 'AB')).toBe(5);
      expect(calculateTax(50, 'AB')).toBe(2.5);
    });

    it('handles Quebec (GST + QST)', () => {
      expect(calculateTax(100, 'QC')).toBeCloseTo(14.98, 2);
    });

    it('returns 0 for invalid amounts', () => {
      expect(calculateTax(-100, 'ON')).toBe(0);
      expect(calculateTax(NaN, 'ON')).toBe(0);
    });
  });

  describe('reverseCalculateTax', () => {
    it('calculates pre-tax amount for Ontario (13% HST)', () => {
      expect(reverseCalculateTax(113, 'ON')).toBeCloseTo(100, 2);
      expect(reverseCalculateTax(56.5, 'ON')).toBeCloseTo(50, 2);
    });

    it('calculates pre-tax amount for Alberta (5% GST)', () => {
      expect(reverseCalculateTax(105, 'AB')).toBeCloseTo(100, 2);
      expect(reverseCalculateTax(52.5, 'AB')).toBeCloseTo(50, 2);
    });

    it('handles Quebec (GST + QST)', () => {
      expect(reverseCalculateTax(114.98, 'QC')).toBeCloseTo(100, 2);
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers as currency', () => {
      expect(formatCurrency(100)).toBe('$100.00');
      expect(formatCurrency(50.5)).toBe('$50.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('handles negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
    });
  });

  describe('getTaxRate', () => {
    it('returns correct rate for provinces', () => {
      expect(getTaxRate('ON')).toBe(0.13);
      expect(getTaxRate('AB')).toBe(0.05);
      expect(getTaxRate('QC')).toBeCloseTo(0.14975);
    });

    it('returns 0 for invalid provinces', () => {
      // @ts-ignore - Testing invalid input
      expect(getTaxRate('XX')).toBe(0);
    });
  });
});
