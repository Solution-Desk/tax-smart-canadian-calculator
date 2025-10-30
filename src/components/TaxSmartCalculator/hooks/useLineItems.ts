import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../../../lib/taxData';

export interface LineItemForm {
  id: string;
  label: string;
  category: Category;
  amount: string;
}

export const useLineItems = (initialItems: LineItemForm[] = []) => {
  const [items, setItems] = useState<LineItemForm[]>(initialItems);

  const createLineItem = useCallback((index: number, overrides: Partial<LineItemForm> = {}): LineItemForm => ({
    id: uuidv4(),
    label: `Item ${index}`,
    category: 'standard' as Category,
    amount: '',
    ...overrides,
  }), []);

  const addItem = useCallback((overrides?: Partial<LineItemForm>) => {
    setItems(prev => [...prev, createLineItem(prev.length + 1, overrides)]);
  }, [createLineItem]);

  const updateItem = useCallback((id: string, changes: Partial<LineItemForm>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...changes } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearItems = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    setItems,
  };
};
