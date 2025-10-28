/**
 * Tax rates by Canadian province/territory
 * GST: 5% federal tax (applies everywhere)
 * PST: Provincial sales tax (varies by province)
 * HST: Harmonized Sales Tax (combines GST + PST in some provinces)
 */

type ProvinceCode = 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

interface TaxRate {
  gst: number;  // Federal GST rate (5% everywhere)
  pst?: number;  // Provincial sales tax (if applicable)
  hst?: number;  // Harmonized sales tax (if applicable)
  name: string;  // Full province/territory name
}

const TAX_RATES: Record<ProvinceCode, TaxRate> = {
  // Alberta - GST only (5%)
  AB: { gst: 0.05, name: 'Alberta' },
  
  // British Columbia - GST (5%) + PST (7%)
  BC: { gst: 0.05, pst: 0.07, name: 'British Columbia' },
  
  // Manitoba - GST (5%) + RST (7%)
  MB: { gst: 0.05, pst: 0.07, name: 'Manitoba' },
  
  // New Brunswick - HST (15%)
  NB: { gst: 0.05, hst: 0.15, name: 'New Brunswick' },
  
  // Newfoundland and Labrador - HST (15%)
  NL: { gst: 0.05, hst: 0.15, name: 'Newfoundland and Labrador' },
  
  // Northwest Territories - GST only (5%)
  NT: { gst: 0.05, name: 'Northwest Territories' },
  
  // Nova Scotia - HST (15%)
  NS: { gst: 0.05, hst: 0.15, name: 'Nova Scotia' },
  
  // Nunavut - GST only (5%)
  NU: { gst: 0.05, name: 'Nunavut' },
  
  // Ontario - HST (13%)
  ON: { gst: 0.05, hst: 0.13, name: 'Ontario' },
  
  // Prince Edward Island - HST (15%)
  PE: { gst: 0.05, hst: 0.15, name: 'Prince Edward Island' },
  
  // Quebec - GST (5%) + QST (9.975%)
  QC: { gst: 0.05, pst: 0.09975, name: 'Quebec' },
  
  // Saskatchewan - GST (5%) + PST (6%)
  SK: { gst: 0.05, pst: 0.06, name: 'Saskatchewan' },
  
  // Yukon - GST only (5%)
  YT: { gst: 0.05, name: 'Yukon' },
};

/**
 * Calculate the tax amount for a given amount in a province/territory
 * @param amount The pre-tax amount in dollars
 * @param province The province/territory code (e.g., 'ON', 'AB')
 * @returns The tax amount in dollars
 */
export function calculateTax(amount: number, province: ProvinceCode): number {
  if (amount < 0) return 0;
  
  const rate = TAX_RATES[province];
  
  // If HST is defined, use it (GST + PST combined)
  if (rate.hst !== undefined) {
    return roundToCents(amount * rate.hst);
  }
  
  // Otherwise, calculate GST + PST separately
  const gstAmount = amount * rate.gst;
  const pstAmount = rate.pst ? amount * rate.pst : 0;
  
  return roundToCents(gstAmount + pstAmount);
}

/**
 * Calculate the total amount including tax
 * @param amount The pre-tax amount in dollars
 * @param province The province/territory code (e.g., 'ON', 'AB')
 * @returns The total amount including tax in dollars
 */
export function calculateTotal(amount: number, province: ProvinceCode): number {
  if (amount < 0) return 0;
  const tax = calculateTax(amount, province);
  return roundToCents(amount + tax);
}

/**
 * Calculate the pre-tax amount from a total amount that includes tax
 * @param total The total amount including tax in dollars
 * @param province The province/territory code (e.g., 'ON', 'AB')
 * @returns The pre-tax amount in dollars
 */
export function reverseTax(total: number, province: ProvinceCode): number {
  if (total <= 0) return 0;
  
  const rate = TAX_RATES[province];
  
  // If HST is defined, use it (GST + PST combined)
  if (rate.hst !== undefined) {
    return roundToCents(total / (1 + rate.hst));
  }
  
  // For GST + PST, we need to solve: total = amount + (amount * gst) + (amount * pst)
  // Which simplifies to: amount = total / (1 + gst + pst)
  const totalRate = 1 + rate.gst + (rate.pst || 0);
  return roundToCents(total / totalRate);
}

/**
 * Get the tax rate information for a province/territory
 * @param province The province/territory code (e.g., 'ON', 'AB')
 * @returns The tax rate information
 */
export function getTaxRateInfo(province: ProvinceCode): TaxRate & { totalRate: number } {
  const rate = { ...TAX_RATES[province] };
  
  // Calculate the total tax rate
  const totalRate = rate.hst !== undefined 
    ? rate.hst 
    : rate.gst + (rate.pst || 0);
  
  return { ...rate, totalRate };
}

/**
 * Get a list of all supported provinces/territories with their codes and names
 * @returns Array of province/territory objects with code and name
 */
export function getProvinces(): Array<{ code: ProvinceCode; name: string }> {
  return Object.entries(TAX_RATES).map(([code, { name }]) => ({
    code: code as ProvinceCode,
    name,
  }));
}

/**
 * Round a number to 2 decimal places (cents)
 * @param num The number to round
 * @returns The rounded number
 */
function roundToCents(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
