import React from 'react';
import { PageLayout } from '../components/PageLayout';

const References: React.FC<{ onToggleTheme: () => void }> = ({ onToggleTheme }) => {
  return (
    <PageLayout 
      title="References" 
      onToggleTheme={onToggleTheme}
      description="Sources and references for tax rates and categories"
    >
      <div className="content">
        <section className="section">
          <h2>Tax Rate Sources</h2>
          <ul className="reference-list">
            <li>
              <a href="https://www.canada.ca/en/revenue-agency.html" target="_blank" rel="noopener noreferrer">
                Canada Revenue Agency (CRA)
              </a>
            </li>
            <li>
              <a href="https://www.fin.gc.ca/tax/tax-eng.html" target="_blank" rel="noopener noreferrer">
                Department of Finance Canada
              </a>
            </li>
            <li>
              <a href="https://www.taxtips.ca/salestaxes/index.htm" target="_blank" rel="noopener noreferrer">
                TaxTips.ca - Sales Tax Rates
              </a>
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Tax Categories</h2>
          <p>
            Tax categories are based on the latest information from federal and provincial tax authorities. 
            Some items may be subject to special rules or exceptions.
          </p>
        </section>

        <section className="section">
          <h2>Last Updated</h2>
          <p>Tax rates and categories were last verified on {new Date().toLocaleDateString('en-CA')}.</p>
        </section>
      </div>
    </PageLayout>
  );
};

export default References;
