export type Province =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT'

export const PROVINCES: Province[] = ['AB','BC','MB','NB','NL','NS','NT','NU','ON','PE','QC','SK','YT']

export type RateKind = 'HST' | 'GST_PST' | 'GST_QST' | 'GST_ONLY'

export type Rates = {
  kind: RateKind
  gst: number
  hst?: number
  pst?: number
  qst?: number
}

export const TAX_RATES: Record<Province, Rates> = {
  AB: { kind: 'GST_ONLY', gst: 0.05 },
  BC: { kind: 'GST_PST', gst: 0.05, pst: 0.07 },
  MB: { kind: 'GST_PST', gst: 0.05, pst: 0.07 },
  NB: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NL: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NS: { kind: 'HST', gst: 0.05, hst: 0.15 },
  NT: { kind: 'GST_ONLY', gst: 0.05 },
  NU: { kind: 'GST_ONLY', gst: 0.05 },
  ON: { kind: 'HST', gst: 0.05, hst: 0.13 },
  PE: { kind: 'HST', gst: 0.05, hst: 0.15 },
  QC: { kind: 'GST_QST', gst: 0.05, qst: 0.09975 },
  SK: { kind: 'GST_PST', gst: 0.05, pst: 0.06 },
  YT: { kind: 'GST_ONLY', gst: 0.05 }
}

export type Category =
  | 'Standard' | 'Exempt' | 'Zero-rated (basic groceries)'
  | 'Prepared food / restaurant' | "Children's clothing & footwear"
  | "Children's diapers" | "Children's car seats & booster seats"
  | 'Feminine hygiene products' | 'Prescription drugs / medical'
  | 'Printed books (qualifying)' | 'Newspapers (qualifying)'
  | 'Public transit fares' | 'Snack foods / candy' | 'Sweetened carbonated beverages'
  | 'Cannabis (medical)' | 'Cannabis (non-medical)'
  | 'Tobacco / alcohol' | 'GST only' | 'Provincial only'

export const CATEGORY_OPTIONS: Category[] = [
  'Standard','Exempt','Zero-rated (basic groceries)','Prepared food / restaurant',
  "Children's clothing & footwear","Children's diapers","Children's car seats & booster seats",
  'Feminine hygiene products','Prescription drugs / medical','Printed books (qualifying)',
  'Newspapers (qualifying)','Public transit fares','Snack foods / candy','Sweetened carbonated beverages',
  'Cannabis (medical)','Cannabis (non-medical)','Tobacco / alcohol','GST only','Provincial only'
]

export const DEFAULT_PROVINCE: Province = 'BC'

export function getProvincialLabel(kind: RateKind): string {
  switch (kind) {
    case 'HST':
      return 'HST'
    case 'GST_QST':
      return 'QST'
    case 'GST_PST':
      return 'PST'
    default:
      return 'Provincial'
  }
}

export function getProvincialRate(province: Province): number {
  const entry = TAX_RATES[province]
  if (entry.kind === 'HST') return entry.hst ?? 0
  if (entry.kind === 'GST_PST') return entry.pst ?? 0
  if (entry.kind === 'GST_QST') return entry.qst ?? 0
  return 0
}
