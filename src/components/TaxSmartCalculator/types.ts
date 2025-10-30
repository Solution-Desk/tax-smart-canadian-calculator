import { ProvinceCode } from './data/rates';

export interface Totals {
  subtotal: number;
  gst: number;
  pst: number;
  hst: number;
  qst: number;
  totalTax: number;
  grandTotal: number;
}

export interface TotalsDisplayProps {
  totals: Totals;
  province: ProvinceCode;
  className?: string;
  showBreakdown?: boolean;
}

export interface LineItem {
  id: string;
  label: string;
  category: string;
  amount: string;
  taxable?: boolean;
}

export interface LineItemForm extends Omit<LineItem, 'id'> {
  id?: string;
}

export type Category = 
  | 'standard' 
  | 'grocery' 
  | 'childrens_clothing' 
  | 'books' 
  | 'prepared_food' 
  | 'alcohol' 
  | 'tobacco' 
  | 'cannabis' 
  | 'fuel' 
  | 'accommodation' 
  | 'other';

export interface CategoryOption {
  value: Category;
  label: string;
  description?: string;
  taxExempt?: boolean;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'grocery', label: 'Grocery', taxExempt: true },
  { value: 'childrens_clothing', label: "Children's Clothing" },
  { value: 'books', label: 'Books', taxExempt: true },
  { value: 'prepared_food', label: 'Prepared Food' },
  { value: 'alcohol', label: 'Alcohol' },
  { value: 'tobacco', label: 'Tobacco' },
  { value: 'cannabis', label: 'Cannabis' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'other', label: 'Other' },
];
