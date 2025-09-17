import { Category, CATEGORY_OPTIONS } from './taxData';

export interface TaxPreset {
  id: string;
  label: string;
  description: string;
  category: Category;
  isExempt: boolean;
  icon?: string;
}

// Map of preset IDs to their corresponding categories
const PRESET_CATEGORY_MAP: Record<string, Category> = {
  'basic-groceries': 'Zero-rated (basic groceries)',
  'restaurant': 'Prepared food / restaurant',
  'alcohol': 'Tobacco / alcohol',
  'clothing': 'Standard',
  'children-clothing': "Children's clothing & footwear",
  'books': 'Printed books (qualifying)',
  'electronics': 'Standard',
  'transportation': 'Public transit fares',
  'health': 'Prescription drugs / medical',
  'education': 'Standard'
};

export const TAX_PRESETS: TaxPreset[] = [
  {
    id: 'basic-groceries',
    label: 'Basic Groceries',
    description: 'Most food and beverages for human consumption',
    category: 'Zero-rated (basic groceries)',
    isExempt: true,
    icon: '🍎',
  },
  {
    id: 'restaurant',
    label: 'Restaurant Meals',
    description: 'Meals from restaurants and fast food',
    category: 'Prepared food / restaurant',
    isExempt: false,
    icon: '🍽️',
  },
  {
    id: 'alcohol',
    label: 'Alcoholic Beverages',
    description: 'Beer, wine, and spirits',
    category: 'Tobacco / alcohol',
    isExempt: false,
    icon: '🍷',
  },
  {
    id: 'clothing',
    label: 'Clothing & Footwear',
    description: 'Clothing, shoes, and accessories',
    category: 'Standard',
    isExempt: false,
    icon: '👕',
  },
  {
    id: 'children-clothing',
    label: "Children's Clothing",
    description: 'Clothing and footwear for children under 15',
    category: "Children's clothing & footwear",
    isExempt: true,
    icon: '👶',
  },
  {
    id: 'books',
    label: 'Books',
    description: 'Printed books, including textbooks',
    category: 'Printed books (qualifying)',
    isExempt: true,
    icon: '📚',
  },
  {
    id: 'electronics',
    label: 'Electronics',
    description: 'Computers, phones, and other electronics',
    category: 'Standard',
    isExempt: false,
    icon: '💻',
  },
  {
    id: 'transportation',
    label: 'Public Transportation',
    description: 'Bus, train, and subway fares',
    category: 'Public transit fares',
    isExempt: true,
    icon: '🚌',
  },
  {
    id: 'health',
    label: 'Health & Medical',
    description: 'Prescription drugs and medical devices',
    category: 'Prescription drugs / medical',
    isExempt: true,
    icon: '💊',
  },
  {
    id: 'education',
    label: 'Education',
    description: 'Tuition and educational services',
    category: 'Standard',
    isExempt: false,
    icon: '🎓',
  },
];

export function getPresetById(id: string): TaxPreset | undefined {
  return TAX_PRESETS.find((preset) => preset.id === id);
}

export function getPresetsByCategory(category: string): TaxPreset[] {
  return TAX_PRESETS.filter((preset) => preset.category === category);
}
