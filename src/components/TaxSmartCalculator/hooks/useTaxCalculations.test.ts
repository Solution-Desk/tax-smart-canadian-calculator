import { describe, it, expect } from 'vitest';
import { calcTotalsFromSubtotal } from './useTaxCalculations';

describe('tax calculations', () => {
  it('calculates taxes for BC correctly', () => {
    const result = calcTotalsFromSubtotal('BC', 100);
    expect(result.gst).toBe(5);
    expect(result.pst).toBe(7);
    expect(result.grandTotal).toBe(112);
  });

  it('calculates taxes for ON correctly', () => {
    const result = calcTotalsFromSubtotal('ON', 100);
    expect(result.hst).toBe(13);
    expect(result.grandTotal).toBe(113);
  });

  it('calculates taxes for QC correctly', () => {
    const result = calcTotalsFromSubtotal('QC', 100);
    expect(result.gst).toBe(5);
    expect(result.qst).toBeCloseTo(9.98); // 9.975 rounded to 2 decimal places
    expect(result.grandTotal).toBeCloseTo(114.98);
  });

  it('handles zero amount', () => {
    const result = calcTotalsFromSubtotal('BC', 0);
    expect(result.gst).toBe(0);
    expect(result.pst).toBe(0);
    expect(result.grandTotal).toBe(0);
  });
});
