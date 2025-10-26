// Tax rates by province/territory (GST/HST/PST/QST)
type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

type TaxInfo = {
  rate: number;
  name: string;
  description: string;
};

export const TAX_RATES: Record<ProvinceCode, TaxInfo> = {
  AB: { rate: 0.05, name: 'GST', description: 'Goods and Services Tax' },
  BC: { rate: 0.12, name: 'GST + PST', description: 'Goods and Services Tax + Provincial Sales Tax' },
  MB: { rate: 0.12, name: 'GST + PST', description: 'Goods and Services Tax + Provincial Sales Tax' },
  NB: { rate: 0.15, name: 'HST', description: 'Harmonized Sales Tax' },
  NL: { rate: 0.15, name: 'HST', description: 'Harmonized Sales Tax' },
  NS: { rate: 0.15, name: 'HST', description: 'Harmonized Sales Tax' },
  NT: { rate: 0.05, name: 'GST', description: 'Goods and Services Tax' },
  NU: { rate: 0.05, name: 'GST', description: 'Goods and Services Tax' },
  ON: { rate: 0.13, name: 'HST', description: 'Harmonized Sales Tax' },
  PE: { rate: 0.15, name: 'HST', description: 'Harmonized Sales Tax' },
  QC: { rate: 0.14975, name: 'GST + QST', description: 'Goods and Services Tax + Quebec Sales Tax' },
  SK: { rate: 0.11, name: 'GST + PST', description: 'Goods and Services Tax + Provincial Sales Tax' },
  YT: { rate: 0.05, name: 'GST', description: 'Goods and Services Tax' },
};

/**
 * Get tax rate for a province/territory
 */
export const getTaxRate = (province: ProvinceCode): number => {
  return TAX_RATES[province]?.rate || 0;
};

/**
 * Calculate tax amount for a given amount and province
 */
export const calculateTax = (
  amount: number,
  province: ProvinceCode,
  round = true
): number => {
  if (isNaN(amount) || amount <= 0) return 0;
  
  const rate = getTaxRate(province);
  const tax = amount * rate;
  
  return round ? Math.round(tax * 100) / 100 : tax;
};

/**
 * Calculate the pre-tax amount from a total amount including tax
 */
export const reverseCalculateTax = (
  total: number,
  province: ProvinceCode,
  round = true
): number => {
  if (isNaN(total) || total <= 0) return 0;
  
  const rate = getTaxRate(province);
  const amount = total / (1 + rate);
  
  return round ? Math.round(amount * 100) / 100 : amount;
};

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  locale = 'en-CA',
  currency = 'CAD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (
  value: number,
  decimals = 1,
  locale = 'en-CA'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Get tax breakdown for a province
 */
export const getTaxBreakdown = (province: ProvinceCode) => {
  const info = TAX_RATES[province];
  if (!info) return [];

  // Special case for Quebec (GST + QST)
  if (province === 'QC') {
    return [
      { name: 'GST', rate: 0.05 },
      { name: 'QST', rate: 0.0975 },
    ];
  }

  // Special case for HST provinces
  if (info.name === 'HST') {
    // HST is a single tax, but we can show the breakdown for transparency
    const hstRate = info.rate;
    let federal = 0.05; // GST portion
    let provincial = hstRate - federal;

    return [
      { name: 'GST', rate: federal },
      { name: 'HST', rate: provincial },
    ];
  }

  // For GST + PST provinces
  if (info.name === 'GST + PST') {
    const gst = 0.05;
    const pst = info.rate - gst;
    
    return [
      { name: 'GST', rate: gst },
      { name: 'PST', rate: pst },
    ];
  }

  // Default to just GST
  return [
    { name: 'GST', rate: info.rate },
  ];
};

/**
 * Get all provinces/territories with their tax info
 */
export const getProvinces = () => {
  return Object.entries(TAX_RATES).map(([code, info]) => ({
    code,
    ...info,
  }));
};
