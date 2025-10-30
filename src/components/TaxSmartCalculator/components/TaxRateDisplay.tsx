import React from 'react';
import { Province } from '../../../lib/taxData';
import {
  getStandardTaxRate,
  getGroceryTaxRate,
  getChildrensClothingTaxRate,
  getBookTaxRate
} from '../utils/taxCalculations';

interface TaxRateDisplayProps {
  province: Province;
  className?: string;
}

export const TaxRateDisplay: React.FC<TaxRateDisplayProps> = ({ 
  province,
  className = ''
}) => {
  return (
    <div className={`text-sm ${className}`}>
      <h3 className="font-medium mb-2">Tax Rates for {province}</h3>
      <div className="space-y-1">
        <div>Standard Rate: {getStandardTaxRate(province)}</div>
        <div>Grocery Rate: {getGroceryTaxRate(province)}</div>
        <div>Children's Clothing: {getChildrensClothingTaxRate(province)}</div>
        <div>Books: {getBookTaxRate(province)}</div>
      </div>
    </div>
  );
};
