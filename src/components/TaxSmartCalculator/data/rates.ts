export type ProvinceCode =
  | 'AB' | 'BC' | 'MB' | 'NB' | 'NL' | 'NS' | 'NT' | 'NU' | 'ON' | 'PE' | 'QC' | 'SK' | 'YT';

type RateShape =
  | { kind: 'GST'; gst: number }
  | { kind: 'GST_PST'; gst: number; pst: number }
  | { kind: 'HST'; hst: number }
  | { kind: 'GST_QST'; gst: number; qst: number };

export const RATES: Record<ProvinceCode, RateShape> = {
  AB: { kind: 'GST', gst: 5 },
  BC: { kind: 'GST_PST', gst: 5, pst: 7 },
  MB: { kind: 'GST_PST', gst: 5, pst: 7 },
  NB: { kind: 'HST', hst: 15 },
  NL: { kind: 'HST', hst: 15 },
  NS: { kind: 'HST', hst: 15 },
  NT: { kind: 'GST', gst: 5 },
  NU: { kind: 'GST', gst: 5 },
  ON: { kind: 'HST', hst: 13 },
  PE: { kind: 'HST', hst: 15 },
  QC: { kind: 'GST_QST', gst: 5, qst: 9.975 },
  SK: { kind: 'GST_PST', gst: 5, pst: 6 },
  YT: { kind: 'GST', gst: 5 }
};

export const PROVINCE_LABELS: Record<ProvinceCode, string> = {
  AB: 'Alberta', 
  BC: 'British Columbia', 
  MB: 'Manitoba', 
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador', 
  NS: 'Nova Scotia', 
  NT: 'Northwest Territories',
  NU: 'Nunavut', 
  ON: 'Ontario', 
  PE: 'Prince Edward Island', 
  QC: 'Québec',
  SK: 'Saskatchewan', 
  YT: 'Yukon'
};
