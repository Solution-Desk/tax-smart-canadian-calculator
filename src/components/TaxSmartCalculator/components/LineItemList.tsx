import React from 'react';
import { Category } from '../../lib/taxData';

interface LineItem {
  id: string;
  label: string;
  category: Category;
  amount: string;
}

interface LineItemListProps {
  items: LineItem[];
  onUpdateItem: (id: string, changes: Partial<LineItem>) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (overrides?: Partial<LineItem>) => void;
  availableCategories: { value: string; label: string }[];
  className?: string;
}

export const LineItemList: React.FC<LineItemListProps> = ({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
  availableCategories,
  className = '',
}) => {
  const handleAmountChange = (id: string, amount: string) => {
    // Basic validation - allow numbers and decimal points
    if (/^\d*\.?\d*$/.test(amount) || amount === '') {
      onUpdateItem(id, { amount });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Items</h3>
        <button
          onClick={() => onAddItem()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + Add Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
            <input
              type="text"
              value={item.label}
              onChange={(e) => onUpdateItem(item.id, { label: e.target.value })}
              placeholder="Item description"
              className="flex-1 p-2 border rounded"
            />
            <select
              value={item.category}
              onChange={(e) => onUpdateItem(item.id, { category: e.target.value as Category })}
              className="p-2 border rounded"
            >
              {availableCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <input
                type="text"
                value={item.amount}
                onChange={(e) => handleAmountChange(item.id, e.target.value)}
                placeholder="0.00"
                className="pl-6 p-2 border rounded w-24 text-right"
              />
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-red-500 hover:text-red-700"
              aria-label="Remove item"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
