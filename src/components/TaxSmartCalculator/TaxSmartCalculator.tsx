import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CATEGORY_OPTIONS,
  Category,
  DEFAULT_PROVINCE,
  PROVINCES,
  Province,
  TAX_RATES,
  getProvincialLabel,
  getProvincialRate,
} from "../../lib/taxData"
import { LineItemInput, calculateTotals, validateCategory } from "../../lib/taxCalculator"
import { encodeState, extractStateFromHash } from "../../lib/share"
import { useDarkMode } from "../../hooks/useDarkMode"
import { useLocalStorage } from "../../hooks/useAutoCalc"
import { TAX_PRESETS } from "../../lib/taxPresets"
import { Sparkles } from 'lucide-react'
import "./TaxSmartCalculator.css"

type LineItemForm = {
  id: string
  label: string
  category: Category
  amount: string
}

const CURRENCY = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })
const CONTACT_EMAIL = 'taxapp@thesolutiondesk.ca'
const SPONSOR_URL = 'https://github.com/sponsors/Solution-Desk'
const SPONSOR_IFRAME_PROPS = {
  src: 'https://github.com/sponsors/Solution-Desk/button',
  title: 'Sponsor Solution-Desk',
  height: 32,
  width: 114,
}

const COMING_SOON_FEATURES = [
  {
    title: 'Saved presets & projects',
    description: 'Store favourite configurations so repeat quotes take seconds, not minutes.',
  },
  {
    title: 'Unlimited line items',
    description: 'Remove the cap for complex invoices and detailed cost breakdowns.',
  },
  {
    title: 'CSV & PDF export',
    description: 'Send polished summaries to clients or plug totals into your billing tools.',
  },
  {
    title: 'Batch import (CSV)',
    description: 'Upload spreadsheet estimates and calculate tax on every row automatically.',
  },
  {
    title: 'Private share links (30 days)',
    description: 'Lock down sensitive quotes with expiring, access-controlled links.',
  },
  {
    title: 'Priority support & early previews',
    description: 'Get front-of-queue help plus sneak peeks at new automation upgrades.',
  },
];

function createLineItem(index: number, overrides: Partial<LineItemForm> = {}): LineItemForm {
  return {
    id: crypto.randomUUID(),
    label: overrides.label ?? `Item ${index}`,
    category: overrides.category ?? 'Standard',
    amount: overrides.amount ?? '0',
  }
}

function parseAmount(value: string): number {
  if (!value) return 0
  const numeric = Number.parseFloat(value)
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0
}

function formatCurrency(value: number) {
  return CURRENCY.format(value)
}

async function copyToClipboard(value: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch (error) {
      console.warn('Clipboard write failed', error)
      return false
    }
  }
  return false
}

function toShareableItems(items: LineItemForm[]) {
  return items.map(({ label, category, amount }) => ({
    label,
    category,
    amount,
  }))
}

export default function TaxSmartCalculator() {
  const { theme, toggleTheme } = useDarkMode('dark');
  const [province, setProvince] = useLocalStorage<Province>('taxapp:province', DEFAULT_PROVINCE)
  const [items, setItems] = useState<LineItemForm[]>([createLineItem(1)])
  const [notice, setNotice] = useState<string | null>(null)
  const [resultsVersion, setResultsVersion] = useState(0)

  const numericItems = useMemo<LineItemInput[]>(
    () => items.map((item) => ({ amount: parseAmount(item.amount), category: item.category })),
    [items],
  )

  const { totals } = useMemo(
    () => calculateTotals(numericItems, province),
    [numericItems, province]
  )

  const provincialLabel = getProvincialLabel(TAX_RATES[province].kind)
  const provincialRate = getProvincialRate(province)

  const showNotice = useCallback((message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 1800)
  }, [])

  const handleAddItem = useCallback((presetOrEvent?: (typeof TAX_PRESETS)[number] | React.MouseEvent) => {
    // Handle case where it's called from a click event
    if (presetOrEvent && 'preventDefault' in presetOrEvent) {
      presetOrEvent.preventDefault();
      setItems((current) => [...current, createLineItem(current.length + 1)]);
      return;
    }
    
    // Handle case where it's called with a preset
    const preset = presetOrEvent as (typeof TAX_PRESETS)[number] | undefined;
    setItems((current) => [
      ...current, 
      createLineItem(current.length + 1, {
        label: preset?.label || '',
        category: preset?.category || 'Standard',
      })
    ]);
  }, [])

  const handleRemoveItem = useCallback((id: string) => {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current))
  }, [])

  const handleUpdateItem = useCallback((id: string, patch: Partial<LineItemForm>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const handleCalculate = useCallback(() => {
    setResultsVersion((version) => version + 1)
    showNotice('Totals refreshed')
  }, [showNotice])

  const handleCopyShareLink = React.useCallback(async () => {
    const parts = [
      `Province: ${province}`,
      `Subtotal: ${formatCurrency(totals.subTotal)}`,
      TAX_RATES[province].kind === 'HST'
        ? `HST: ${formatCurrency(totals.hst)}`
        : `GST: ${formatCurrency(totals.federal)}\n${provincialLabel}: ${formatCurrency(totals.provincial)}`,
      `Total tax: ${formatCurrency(totals.tax)}`,
      `Grand total: ${formatCurrency(totals.grandTotal)}`,
    ]
    const success = await copyToClipboard(parts.join('\n'))
    showNotice(success ? 'Results copied to clipboard' : 'Clipboard not available')
  }, [province, provincialLabel, showNotice, totals])

  const handleCopyAppLink = React.useCallback(async () => {
    if (typeof window === 'undefined') return
    const shareUrl = new URL(window.location.href)
    shareUrl.hash = encodeState({ province, items: toShareableItems(items) })
    const success = await copyToClipboard(shareUrl.toString())
    showNotice(success ? 'Shareable link copied' : 'Clipboard not available')
  }, [items, province, showNotice])

  const handleCopyEmail = React.useCallback(async () => {
    const success = await copyToClipboard(CONTACT_EMAIL)
    if (success) {
      showNotice('Email copied to clipboard.')
      return
    }

    window.location.href = `mailto:${CONTACT_EMAIL}`
  }, [showNotice])

  // Auto-calculated via useMemo with [numericItems, province] dependency

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const state = extractStateFromHash(window.location.hash)
    if (!state) return

    setProvince(state.province)
    setItems(
      state.items.length
        ? state.items.map((item, index) =>
            createLineItem(index + 1, {
              label: item.label,
              category: validateCategory(item.category),
              amount: item.amount,
            })
          )
        : [createLineItem(1)],
    )
  }, [])

  return (
    <div className="calculator-shell">
      <header className="calculator-header">
        <div className="calculator-brand">
          <span className="calculator-logo" aria-hidden>CA</span>
          <div>
            <p className="brand-name">TaxSmart</p>
            <p className="brand-tagline">GST / HST / PST & QST in one view</p>
          </div>
        </div>
        <div className="header-actions">
          <span className="badge">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            <span>Premium coming soon</span>
          </span>
          <button type="button" className="btn whitespace-nowrap" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      {notice && (
        <div role="status" className="calculator-notice">
          {notice}
        </div>
      )}

      <main className="calculator-main grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="panel">
          <div className="panel-header">
            <h1 className="panel-title">Canada sales-tax smart calculator</h1>
            <span className="badge">Free forever</span>
          </div>
          <p className="panel-subtitle">
            Estimate combined GST, HST, PST, and QST with per-province category rules.
          </p>

          <div className="province-grid">
            <article className="total-card form-field-card" aria-labelledby="province-select-label">
              <label id="province-select-label" className="field-label" htmlFor="province-select">
                Province / Territory
              </label>
              <select
                id="province-select"
                className="input select"
                value={province}
                onChange={(event) => setProvince(event.target.value as Province)}
              >
                {PROVINCES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </article>
            <div className="rate-cards">
              <div className="rate-card">
                <p className="muted">Federal (GST)</p>
                <p className="rate-value">{(TAX_RATES[province].gst * 100).toFixed(1)}%</p>
              </div>
              <div className="rate-card">
                <p className="muted">Provincial ({provincialLabel})</p>
                <p className="rate-value">{provincialRate ? `${(provincialRate * 100).toFixed(2)}%` : '—'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Line items</h2>
          </div>
          <div className="line-items">
            {items.map((item) => (
              <div key={item.id} className="line-item">
                <label className="sr-only" htmlFor={`label-${item.id}`}>
                  Item label
                </label>
                <input
                  id={`label-${item.id}`}
                  className="input"
                  value={item.label}
                  onChange={(event) => handleUpdateItem(item.id, { label: event.target.value })}
                  placeholder="Item label"
                />
                <label className="sr-only" htmlFor={`category-${item.id}`}>
                  Item category
                </label>
                <select
                  id={`category-${item.id}`}
                  className="input"
                  value={item.category}
                  onChange={(event) => handleUpdateItem(item.id, { category: event.target.value as Category })}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <label className="sr-only" htmlFor={`amount-${item.id}`}>
                  Item amount
                </label>
                <div className="amount-field">
                  <span aria-hidden>$</span>
                  <input
                    id={`amount-${item.id}`}
                    className="input"
                    value={item.amount}
                    onChange={(event) => handleUpdateItem(item.id, { amount: event.target.value })}
                    inputMode="decimal"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  className="btn icon"
                  aria-label="Remove line item"
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="line-items-actions">
            <div className="preset-dropdown">
              <select
                className="preset-select"
                onChange={(e) => {
                  const presetId = e.target.value;
                  if (presetId) {
                    const preset = TAX_PRESETS.find(p => p.id === presetId);
                    if (preset) {
                      handleAddItem(preset);
                    }
                  }
                  e.target.value = ''; // Reset the select
                }}
                value=""
              >
                <option value="">Add common item...</option>
                <optgroup label="Common Items">
                  {TAX_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.icon} {preset.label}
                    </option>
                  ))}
                </optgroup>
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
            <button type="button" className="btn ghost" onClick={handleAddItem}>
              + Add Custom Item
            </button>
            <button type="button" className="btn primary" onClick={handleCalculate}>
              Calculate tax
            </button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2 className="panel-title flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-amber-500" aria-hidden />
              <span>Premium features coming soon</span>
            </h2>
          </div>
          <p className="panel-subtitle">
            We pressed pause on paid plans while we polish the experience. Here’s what will launch when subscriptions open up.
          </p>
          <ul className="space-y-3">
            {COMING_SOON_FEATURES.map((feature) => (
              <li key={feature.title} className="rounded-xl border border-dashed border-amber-400/60 bg-amber-500/5 p-4">
                <p className="font-semibold text-amber-700 dark:text-amber-200">{feature.title}</p>
                <p className="text-sm text-amber-800/80 dark:text-amber-100/70">{feature.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section key={resultsVersion} className="panel">
          <div className="panel-header">
            <h2 className="panel-title">Totals</h2>
            <div className="header-actions">
              <button type="button" className="btn" onClick={handleCopyAppLink}>
                Share app
              </button>
              <button type="button" className="btn" onClick={handleCopyShareLink}>
                Copy results
              </button>
            </div>
          </div>
          <div className="totals-grid">
            <article className="total-card">
              <p className="muted">Subtotal</p>
              <p className="total-value">{formatCurrency(totals.subTotal)}</p>
            </article>
            {TAX_RATES[province].kind === 'HST' ? (
              <article className="total-card">
                <p className="muted">HST</p>
                <p className="total-value">{formatCurrency(totals.hst)}</p>
              </article>
            ) : (
              <>
                <article className="total-card">
                  <p className="muted">GST</p>
                  <p className="total-value">{formatCurrency(totals.federal)}</p>
                </article>
                <article className="total-card">
                  <p className="muted">{provincialLabel}</p>
                  <p className="total-value">{formatCurrency(totals.provincial)}</p>
                </article>
              </>
            )}
            <article className="total-card">
              <p className="muted">Total tax</p>
              <p className="total-value">{formatCurrency(totals.tax)}</p>
            </article>
            <article className="total-card highlight">
              <p className="muted">Grand total</p>
              <p className="total-value">{formatCurrency(totals.grandTotal)}</p>
            </article>
          </div>
        </section>

        <section className="panel">
          <h2 className="panel-title">References</h2>
          <ul className="reference-list">
            <li>
              <a href="https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-type-supply.html" target="_blank" rel="noreferrer">
                CRA: Charge & collect GST/HST by type of supply
              </a>
            </li>
            <li>
              <a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/gi-063.html" target="_blank" rel="noreferrer">
                CRA GI-063: Ontario point-of-sale rebates (children's goods, books, diapers, car seats)
              </a>
            </li>
            <li>
              <a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/gi-060.html" target="_blank" rel="noreferrer">
                CRA GI-060: Ontario point-of-sale rebate on newspapers
              </a>
            </li>
            <li>
              <a href="https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst" target="_blank" rel="noreferrer">
                BC PST overview & exemptions
              </a>
            </li>
            <li>
              <a href="https://www2.gov.bc.ca/gov/content/taxes/sales-taxes/pst/ice-cream-sweetened-beverages" target="_blank" rel="noreferrer">
                BC PST: Sweetened carbonated beverages
              </a>
            </li>
            <li>
              <a href="https://www.gov.mb.ca/finance/taxation/taxes/retail.html" target="_blank" rel="noreferrer">
                Manitoba RST exemptions (incl. children's clothing)
              </a>
            </li>
            <li>
              <a href="https://www.revenuquebec.ca/en/" target="_blank" rel="noreferrer">
                Revenu Québec: QST exemptions (books, baby products)
              </a>
            </li>
          </ul>
          <p className="muted">
            Excise duties or deposits on alcohol, tobacco, cannabis, and containers are not included.
          </p>
        </section>

        <section className="panel">
          <h2 className="panel-title">Need help or have ideas?</h2>
          <p>
            Spot a rate mismatch, want a new workflow shortcut, or need a second set of eyes on your quote?
            Reach us at the address below and we’ll get back within one business day.
          </p>
          <div className="contact-email-group">
            <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button type="button" className="btn ghost btn-copy-email" onClick={handleCopyEmail}>
              Copy
            </button>
          </div>
          <a
            className="btn primary feedback-sponsor"
            href={SPONSOR_URL}
            target="_blank"
            rel="noreferrer"
          >
            Support us on GitHub Sponsors
          </a>
          <iframe
            className="sponsor-iframe"
            {...SPONSOR_IFRAME_PROPS}
            style={{ border: 0, borderRadius: '6px' }}
          />
        </section>
      </main>

      <footer className="calculator-footer">
        <span>Built for Canadians. Totally free. No ads.</span>
        <a
          className="btn ghost footer-sponsor"
          href={SPONSOR_URL}
          target="_blank"
          rel="noreferrer"
        >
          Sponsor us on GitHub
        </a>
        <iframe
          className="sponsor-iframe"
          {...SPONSOR_IFRAME_PROPS}
          style={{ border: 0, borderRadius: '6px' }}
        />
      </footer>
    </div>
  )
}
