import React from 'react';
import { TotalsDisplayProps } from '../types';

const CURRENCY = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD'
});

const formatCurrency = (amount: number): string => CURRENCY.format(amount);

export const TotalsDisplay: React.FC<TotalsDisplayProps> = ({
  totals,
  province,
  className = '',
  showBreakdown = true
}) => {
  const {
    subtotal,
    gst,
    pst,
    hst,
    qst,
    total
  } = totals;

  // Determine which taxes to show based on province
  const showGST = gst > 0;
  const showPST = pst > 0 && !hst;
  const showQST = qst > 0 && !hst;
  const showHST = hst > 0;

  return (
    <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>

        {showBreakdown && (
          <>
            {showGST && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%):</span>
                <span>{formatCurrency(gst)}</span>
              </div>
            )}
            
            {showPST && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>PST ({province}):</span>
                <span>{formatCurrency(pst)}</span>
              </div>
            )}
            
            {showQST && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>QST (9.975%):</span>
                <span>{formatCurrency(qst)}</span>
              </div>
            )}
            
            {showHST && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>HST ({province}):</span>
                <span>{formatCurrency(hst)}</span>
              </div>
            )}
          </>
        )}

        <div className="border-t border-gray-200 my-2"></div>
        
        <div className="flex justify-between font-semibold text-lg">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};
