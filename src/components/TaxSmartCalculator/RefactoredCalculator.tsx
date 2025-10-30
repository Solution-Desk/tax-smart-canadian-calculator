import { useEffect, useState } from 'react';
import AppBar from './components/AppBar';
import ProvinceSelector from './components/ProvinceSelector';
import TotalsDisplay from './components/TotalsDisplay';
import LineItems from './components/LineItems';
import useTaxCalculations, { type LineItem } from './hooks/useTaxCalculations';
import { ProvinceCode } from './data/rates';
import { fmtCAD } from '../../lib/money';

const TaxSmartCalculator = () => {
  // State for province selection
  const [province, setProvince] = useState<ProvinceCode>('ON');
  const [showTotals, setShowTotals] = useState(false);

  // Use the tax calculations hook
  const {
    items,
    totals,
    addItem,
    updateItem,
    removeItem,
    setProvince: setTaxProvince,
  } = useTaxCalculations(province);

  // Sync province with tax calculations
  useEffect(() => {
    setTaxProvince(province);
  }, [province, setTaxProvince]);

  // Toggle mobile totals panel
  const toggleTotals = () => {
    document.documentElement.classList.toggle('ts-totals-open');
    setShowTotals(!showTotals);
  };

  // Handle input focus to hide totals on mobile
  useEffect(() => {
    const onFocus = (e: Event) => {
      const el = e.target as HTMLElement;
      if (el?.tagName === 'INPUT' || el?.tagName === 'SELECT' || el?.tagName === 'TEXTAREA') {
        document.documentElement.classList.remove('ts-totals-open');
      }
    };
    window.addEventListener('focusin', onFocus);
    return () => window.removeEventListener('focusin', onFocus);
  }, []);

  return (
    <div className="ts-app">
      <AppBar title="TaxSmart" />

      <main className="ts-container">
        <section className="ts-section">
          <h1 className="ts-h1">Canadian Tax Calculator</h1>
          <p className="ts-subtitle">
            Calculate GST/HST, PST, QST and more for all Canadian provinces and territories
          </p>

          <div className="ts-card">
            <ProvinceSelector 
              value={province}
              onChange={setProvince}
            />
          </div>

          <LineItems 
            items={items}
            onAdd={() => addItem()}
            onUpdate={updateItem}
            onRemove={removeItem}
          />

          <div className="ts-totals-chip" onClick={toggleTotals}>
            <span>View Totals</span>
            <span className="ts-amount">{fmtCAD(totals.total)}</span>
          </div>
        </section>

        <div className={`ts-totals-sheet ${showTotals ? 'open' : ''}`}>
          <div className="ts-totals-header">
            <h2>Totals</h2>
            <button className="btn ghost" onClick={toggleTotals}>
              ✕
            </button>
          </div>
          <TotalsDisplay 
            subtotal={totals.subtotal}
            tax={totals.tax}
            total={totals.total}
            provincialTax={totals.provincialTax}
            federalTax={totals.federalTax}
            provincialLabel={totals.provincialLabel}
          />
        </div>
      </main>

      <style jsx>{`
        .ts-app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .ts-container {
          flex: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          padding-bottom: 100px; // Space for mobile totals chip
        }

        .ts-section {
          max-width: 600px;
          margin: 0 auto;
        }

        .ts-h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .ts-subtitle {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .ts-card {
          background: var(--card-bg);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ts-totals-chip {
          position: fixed;
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          background: var(--primary);
          color: white;
          padding: 1rem;
          border-radius: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 100;
          cursor: pointer;
        }

        .ts-totals-chip .ts-amount {
          font-weight: bold;
          font-size: 1.1em;
        }

        .ts-totals-sheet {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--card-bg);
          border-radius: 20px 20px 0 0;
          box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
          transform: translateY(100%);
          transition: transform 0.3s ease;
          z-index: 1000;
          padding: 1.5rem;
          max-height: 80vh;
          overflow-y: auto;
        }

        .ts-totals-sheet.open {
          transform: translateY(0);
        }

        .ts-totals-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 768px) {
          .ts-totals-chip {
            display: none;
          }
          
          .ts-totals-sheet {
            position: static;
            transform: none;
            box-shadow: none;
            border-radius: 8px;
            max-height: none;
            overflow: visible;
          }
          
          .ts-container {
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TaxSmartCalculator;
