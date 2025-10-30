import { useMemo } from 'react';
import { ProvinceCode, RATES } from '../data/rates';
import type { Totals } from '../types';

export type LineItem = {
  id: string;
  label?: string;
  amount: number;          // pre-tax amount for the line
  taxable?: boolean;       // default true; if false, excluded from tax (still in subtotal)
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calcTotalsFromSubtotal(province: ProvinceCode, subtotal: number): Totals {
  const rate = RATES[province];
  const gst = rate.kind === 'GST' || rate.kind === 'GST_PST' || rate.kind === 'GST_QST'
    ? round2(subtotal * ((rate as any).gst / 100)) : 0;
  const pst = rate.kind === 'GST_PST'
    ? round2(subtotal * ((rate as any).pst / 100)) : 0;
  const qst = rate.kind === 'GST_QST'
    ? round2(subtotal * ((rate as any).qst / 100)) : 0;
  const hst = rate.kind === 'HST'
    ? round2(subtotal * ((rate as any).hst / 100)) : 0;

  const totalTax = round2(gst + pst + qst + hst);
  const grandTotal = round2(subtotal + totalTax);

  return { 
    subtotal: round2(subtotal), 
    gst, 
    pst, 
    qst, 
    hst, 
    totalTax, 
    grandTotal 
  };
}

export function calcTotalsFromItems(province: ProvinceCode, items: LineItem[]): Totals {
  const subtotal = round2(items.reduce((s, it) => 
    s + (Number.isFinite(it.amount) ? it.amount : 0), 0));
  const taxableBase = round2(items.reduce((s, it) => 
    s + (it.taxable === false ? 0 : (Number.isFinite(it.amount) ? it.amount : 0)), 0));
  
  // Taxes are applied only on taxableBase, subtotal shows full
  const t = calcTotalsFromSubtotal(province, taxableBase);
  return { ...t, subtotal };
}

export default function useTaxCalculations(
  province: ProvinceCode,
  itemsOrSubtotal: LineItem[] | number
): Totals {
  return useMemo(() => {
    return Array.isArray(itemsOrSubtotal)
      ? calcTotalsFromItems(province, itemsOrSubtotal)
      : calcTotalsFromSubtotal(province, itemsOrSubtotal);
  }, [province, itemsOrSubtotal]);
}

/** Reverse-tax helper: given grand total, back out the pre-tax amount for the province. */
export function reverseTax(province: ProvinceCode, grandTotal: number): number {
  const r = RATES[province];
  const pct =
    r.kind === 'HST' ? r.hst :
    r.kind === 'GST' ? r.gst :
    r.kind === 'GST_PST' ? (r.gst + r.pst) :
    /* GST_QST */ (r.gst + (r as any).qst);
  return round2(grandTotal / (1 + pct / 100));
}
