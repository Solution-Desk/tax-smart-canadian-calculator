export const fmtCAD = (n: number) => 
  new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD' 
  }).format(n);

export const formatRatePct = (rate: number): string =>
  new Intl.NumberFormat('en-CA', { 
    style: 'percent', 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(rate / 100);
