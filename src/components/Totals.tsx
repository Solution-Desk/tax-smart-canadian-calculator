import React, { useEffect, useState } from 'react';
import { Province, TAX_RATES } from '../lib/taxData';

type TotalsProps = {
  province: Province;
  subTotal: number;
  federal: number;
  provincial: number;
  hst: number;
  total: number;
  onShareApp: () => void;
  onCopyResults: () => void;
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-CA', { 
    style: 'currency', 
    currency: 'CAD' 
  }).format(value);
};

const Totals: React.FC<TotalsProps> = ({
  province,
  subTotal,
  federal,
  provincial,
  hst,
  total,
  onShareApp,
  onCopyResults,
}) => {
  const [open, setOpen] = useState(false);

  // Auto-close when an input is focused
  useEffect(() => {
    const onFocus = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') {
        setOpen(false);
      }
    };
    
    window.addEventListener('focusin', onFocus);
    return () => window.removeEventListener('focusin', onFocus);
  }, []);

  const provinceRates = TAX_RATES[province];
  const isHST = provinceRates.kind === 'HST';

  return (
    <>
      {/* Mobile chip */}
      <button 
        className="totals-chip" 
        onClick={() => setOpen(o => !o)} 
        aria-expanded={open}
        aria-label="View totals"
      >
        Total {formatCurrency(total)}
      </button>

      {/* Bottom sheet / desktop panel */}
      <div className={`totals-sheet ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="panel-header">
          <h2 className="panel-title">Totals</h2>
          <div className="header-actions">
            <button type="button" className="btn" onClick={onShareApp}>
              Share app
            </button>
            <button type="button" className="btn" onClick={onCopyResults}>
              Copy results
            </button>
          </div>
        </div>

        <div className="totals-grid">
          <article className="total-card">
            <p className="muted">Subtotal</p>
            <p className="total-value">{formatCurrency(subTotal)}</p>
          </article>

          {isHST ? (
            <article className="total-card">
              <p className="muted">HST</p>
              <p className="total-value">{formatCurrency(hst)}</p>
            </article>
          ) : (
            <>
              <article className="total-card">
                <p className="muted">GST</p>
                <p className="total-value">{formatCurrency(federal)}</p>
              </article>
              <article className="total-card">
                <p className="muted">{province} {provinceRates.pstName || 'PST'}</p>
                <p className="total-value">{formatCurrency(provincial)}</p>
              </article>
            </>
          )}

          <article className="total-card total-card-total">
            <p className="muted">Total</p>
            <p className="total-value">{formatCurrency(total)}</p>
          </article>
        </div>
      </div>
    </>
  );
};

export default Totals;
