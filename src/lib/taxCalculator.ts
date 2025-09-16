import { CATEGORY_OPTIONS, Category, Province, TAX_RATES } from "./taxData"

export type CategoryFlags = { federal: boolean; provincial: boolean }

function getBaseFlags(category: Category): CategoryFlags {
  switch (category) {
    case 'Exempt':
    case 'Zero-rated (basic groceries)':
    case 'Feminine hygiene products':
    case 'Public transit fares':
    case 'Prescription drugs / medical':
      return { federal: false, provincial: false }
    case 'Printed books (qualifying)':
    case 'Newspapers (qualifying)':
      return { federal: true, provincial: true }
    case 'GST only':
      return { federal: true, provincial: false }
    case 'Provincial only':
      return { federal: false, provincial: true }
    default:
      return { federal: true, provincial: true }
  }
}

function applyProvinceOverrides(
  amount: number,
  province: Province,
  category: Category,
  flags: CategoryFlags,
): CategoryFlags {
  let { federal, provincial } = flags

  switch (category) {
    case "Children's clothing & footwear": {
      if (['ON', 'NS', 'PE'].includes(province)) provincial = false
      if (province === 'BC') provincial = false
      if (province === 'MB') provincial = amount <= 150 ? false : true // up to $150 RST-exempt
      break
    }
    case "Children's diapers": {
      if (['ON', 'NS'].includes(province)) provincial = false
      if (['BC', 'MB', 'SK', 'QC'].includes(province)) provincial = false
      break
    }
    case "Children's car seats & booster seats": {
      if (['ON', 'BC', 'MB'].includes(province)) provincial = false
      break
    }
    case 'Prepared food / restaurant': {
      if (province === 'ON' && amount <= 4) provincial = false
      if (province === 'BC') provincial = false
      if (['MB', 'SK'].includes(province)) provincial = true
      break
    }
    case 'Sweetened carbonated beverages': {
      if (['BC', 'MB', 'SK'].includes(province)) provincial = true
      break
    }
    case 'Snack foods / candy': {
      if (province === 'BC') provincial = false
      if (['MB', 'SK'].includes(province)) provincial = true
      break
    }
    case 'Printed books (qualifying)': {
      if (['ON', 'NS', 'NB', 'NL', 'PE'].includes(province)) provincial = false
      if (['BC', 'MB', 'SK', 'QC'].includes(province)) provincial = false
      break
    }
    case 'Newspapers (qualifying)': {
      if (['ON', 'BC'].includes(province)) provincial = false
      break
    }
    default:
      break
  }

  return { federal, provincial }
}

export type LineItemInput = { amount: number; category: Category }

export type LineBreakdown = {
  amount: number
  federalTax: number
  provincialTax: number
  hstTax: number
  totalTax: number
  grandTotal: number
}

export const ZERO_BREAKDOWN: LineBreakdown = {
  amount: 0,
  federalTax: 0,
  provincialTax: 0,
  hstTax: 0,
  totalTax: 0,
  grandTotal: 0,
}

export function calculateLine(
  item: LineItemInput,
  province: Province,
): LineBreakdown {
  const amount = Number.isFinite(item.amount) ? Math.max(item.amount, 0) : 0
  const base = getBaseFlags(item.category)
  const { federal, provincial } = applyProvinceOverrides(amount, province, item.category, base)
  const rates = TAX_RATES[province]

  let federalTax = 0
  let provincialTax = 0
  let hstTax = 0

  if (rates.kind === 'HST') {
    if (federal && provincial) hstTax = amount * (rates.hst ?? 0)
    else if (federal && !provincial) federalTax = amount * rates.gst
    else if (!federal && provincial) provincialTax = amount * ((rates.hst ?? 0) - rates.gst)
  } else if (rates.kind === 'GST_PST') {
    if (federal) federalTax = amount * rates.gst
    if (provincial) provincialTax = amount * (rates.pst ?? 0)
  } else if (rates.kind === 'GST_QST') {
    if (federal) federalTax = amount * rates.gst
    if (provincial) provincialTax = amount * (rates.qst ?? 0)
  } else {
    if (federal) federalTax = amount * rates.gst
  }

  const totalTax = federalTax + provincialTax + hstTax
  return {
    amount,
    federalTax,
    provincialTax,
    hstTax,
    totalTax,
    grandTotal: amount + totalTax,
  }
}

export type Totals = {
  subTotal: number
  federal: number
  provincial: number
  hst: number
  tax: number
  grandTotal: number
}

export function aggregate(lines: LineBreakdown[]): Totals {
  return lines.reduce<Totals>(
    (acc, current) => ({
      subTotal: acc.subTotal + current.amount,
      federal: acc.federal + current.federalTax,
      provincial: acc.provincial + current.provincialTax,
      hst: acc.hst + current.hstTax,
      tax: acc.tax + current.totalTax,
      grandTotal: acc.grandTotal + current.grandTotal,
    }),
    { subTotal: 0, federal: 0, provincial: 0, hst: 0, tax: 0, grandTotal: 0 },
  )
}

export function calculateTotals(items: LineItemInput[], province: Province) {
  const lines = items.map((item) => calculateLine(item, province))
  return { lines, totals: aggregate(lines) }
}

export function validateCategory(value: string): Category {
  return (CATEGORY_OPTIONS.includes(value as Category) ? value : 'Standard') as Category
}
