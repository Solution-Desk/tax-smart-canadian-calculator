import { Province, TAX_RATES } from '../../../lib/taxData';

const PERCENT_FORMATTER = new Intl.NumberFormat('en-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatRatePct = (rate: number | undefined): string => {
  return rate !== undefined ? PERCENT_FORMATTER.format(rate) : '0%';
};

export const getStandardTaxRate = (province: Province): string => {
  const rates = TAX_RATES[province];
  if (!rates) return '0%';
  
  if (rates.kind === 'HST') return `${formatRatePct(rates.hst || 0)} HST`;
  if (rates.kind === 'GST_PST') return `${formatRatePct(rates.gst || 0)} GST + ${formatRatePct(rates.pst || 0)} PST`;
  if (rates.kind === 'GST_QST') return `${formatRatePct(rates.gst || 0)} GST + ${formatRatePct(rates.qst || 0)} QST`;
  return `${formatRatePct(rates.gst || 0)} GST`;
};

export const getGroceryTaxRate = (province: Province): string => {
  const rates = TAX_RATES[province];
  if (!rates) return '0%';
  
  if (['SK', 'MB', 'QC'].includes(province)) {
    const pst = province === 'QC' ? (rates.qst || 0) : (rates.pst || 0);
    const label = province === 'QC' ? 'QST' : 'PST';
    return `0% GST + ${formatRatePct(pst)} ${label}`;
  }
  return '0%';
};

export const getChildrensClothingTaxRate = (province: Province): string => {
  if (['ON', 'NS', 'PE', 'BC'].includes(province)) return '0%';
  if (province === 'MB') return '0% (up to $150)';
  return getStandardTaxRate(province);
};

export const getBookTaxRate = (province: Province): string => {
  if (['ON', 'NS', 'NB', 'NL', 'PE', 'BC', 'MB', 'SK', 'QC'].includes(province)) {
    return '0%';
  }
  return getStandardTaxRate(province);
};

export const calculateItemTotal = (amount: string, category: string, province: Province): number => {
  const numericAmount = parseFloat(amount) || 0;
  // This is a simplified calculation - you'll want to implement the actual tax logic here
  // based on the category and province
  return numericAmount;
};
