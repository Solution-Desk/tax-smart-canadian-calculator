import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  CATEGORY_OPTIONS,
  Category,
  DEFAULT_PROVINCE,
  PROVINCES,
  Province,
  TAX_RATES,
  getProvincialLabel,
  getProvincialRate,
  PREMIUM_CATEGORIES,
} from "../../lib/taxData"
import { LineItemInput, calculateTotals, validateCategory } from "../../lib/taxCalculator"
import { encodeState, extractStateFromHash } from "../../lib/share"
import { useDarkMode } from "../../hooks/useDarkMode"
import { useLocalStorage } from "../../hooks/useAutoCalc"
import { TAX_PRESETS } from "../../lib/taxPresets"
import { Sparkles } from 'lucide-react'
import { Modal } from '../Modal'
import "./TaxSmartCalculator.css"

type LineItemForm = {
  id: string
  label: string
  category: Category
  amount: string
}

const CURRENCY = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })
const PERCENT_FORMATTER = new Intl.NumberFormat('en-CA', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const CONTACT_EMAIL = 'taxapp@thesolutiondesk.ca'
const SPONSOR_URL = 'https://github.com/Solution-Desk?tab=sponsors'

const COMING_SOON_FEATURES = [
  {
    title: 'Saved presets & projects',
    description: 'Store favourite configurations so repeat calculations take seconds, not minutes.',
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
    description: 'Lock down sensitive details with expiring, access-controlled links.',
  },
  {
    title: 'Priority support & early previews',
    description: 'Get front-of-queue help plus sneak peeks at new automation upgrades.',
  },
];

const PREMIUM_CATEGORY_SET = new Set(PREMIUM_CATEGORIES);

function isPremiumCategory(category: Category) {
  return PREMIUM_CATEGORY_SET.has(category);
}

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

function formatPercent(value: number) {
  return `${PERCENT_FORMATTER.format(value * 100)}%`
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
  const [emailNotice, setEmailNotice] = useState<string | null>(null)
  const [isPremiumModalOpen, setPremiumModalOpen] = useState(false)
  const [isReferencesModalOpen, setReferencesModalOpen] = useState(false)
  const emailNoticeTimeoutRef = useRef<ReturnType<typeof window.setTimeout>>()
  const noticeTimeoutRef = useRef<ReturnType<typeof window.setTimeout>>()

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
    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current)
    }
    noticeTimeoutRef.current = window.setTimeout(() => setNotice(null), 1800)
  }, [])

  const showEmailNotice = useCallback((message: string) => {
    setEmailNotice(message)
    if (emailNoticeTimeoutRef.current) {
      window.clearTimeout(emailNoticeTimeoutRef.current)
    }
    emailNoticeTimeoutRef.current = window.setTimeout(() => setEmailNotice(null), 1800)
  }, [])

  const handleAddItem = useCallback((presetOrEvent?: (typeof TAX_PRESETS)[number] | React.MouseEvent) => {
    if (presetOrEvent && 'preventDefault' in presetOrEvent) {
      presetOrEvent.preventDefault();
      setItems((current) => [...current, createLineItem(current.length + 1)]);
      return;
    }

    const preset = presetOrEvent as (typeof TAX_PRESETS)[number] | undefined;
    if (preset?.category && isPremiumCategory(preset.category)) {
      showNotice('Coming soon: premium items like dining, cannabis, and alcohol');
      return;
    }

    setItems((current) => [
      ...current,
      createLineItem(current.length + 1, {
        label: preset?.label || '',
        category: preset?.category || 'Standard',
      })
    ]);
  }, [showNotice])

  const handleRemoveItem = useCallback((id: string) => {
    setItems((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current))
  }, [])

  const handleUpdateItem = useCallback((id: string, patch: Partial<LineItemForm>) => {
    if (patch.category && isPremiumCategory(patch.category as Category)) {
      showNotice('Coming soon: premium items like dining, cannabis, and alcohol');
      return;
    }

    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [showNotice])

  const handleCalculate = useCallback(() => {
    setResultsVersion((version) => version + 1)
    showNotice('Totals refreshed')
  }, [showNotice])

  const handleCopyShareLink = useCallback(async () => {
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

  const handleCopyAppLink = useCallback(async () => {
    if (typeof window === 'undefined') return
    const shareUrl = new URL(window.location.href)
    shareUrl.hash = encodeState({ province, items: toShareableItems(items) })
    const success = await copyToClipboard(shareUrl.toString())
    showNotice(success ? 'Shareable link copied' : 'Clipboard not available')
  }, [items, province, showNotice])

  const handleCopyEmail = useCallback(async () => {
    const success = await copyToClipboard(CONTACT_EMAIL)
    if (success) {
      showEmailNotice('Copied to clipboard')
      return
    }

    showEmailNotice('Opening email app…')
    window.location.href = `mailto:${CONTACT_EMAIL}`
  }, [showEmailNotice])

  // Auto-calculated via useMemo with [numericItems, province] dependency

  useEffect(() => () => {
    if (emailNoticeTimeoutRef.current) {
      window.clearTimeout(emailNoticeTimeoutRef.current)
    }
    if (noticeTimeoutRef.current) {
      window.clearTimeout(noticeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const state = extractStateFromHash(window.location.hash)
    if (!state) return

    setProvince(state.province)
    let strippedPremium = false
    setItems(
      state.items.length
        ? state.items.map((item, index) =>
            createLineItem(index + 1, {
              label: item.label,
              category: (() => {
                const normalised = validateCategory(item.category)
                if (isPremiumCategory(normalised)) {
                  strippedPremium = true
                  return 'Standard'
                }
                return normalised
              })(),
              amount: item.amount,
            })
          )
        : [createLineItem(1)],
    )

    if (strippedPremium) {
      showNotice('Premium items are coming soon. We kept your totals using Standard rates for now.')
    }
  }, [showNotice])

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
          <button
            type="button"
            className="badge-button"
            onClick={() => setPremiumModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isPremiumModalOpen}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            <span>Premium coming soon</span>
          </button>
          <button
            type="button"
            className="btn ghost header-reference-btn"
            onClick={() => setReferencesModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isReferencesModalOpen}
          >
            References
          </button>
          <button type="button" className="btn whitespace-nowrap" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      <Modal
        isOpen={isPremiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        title="Premium features coming soon"
      >
        <p className="modal-lead">
          Premium unlocks planning tools for non-essential purchases – restaurant meals, alcohol,
          recreational cannabis, and more. We’re polishing the experience before launch.
        </p>
        <ul className="modal-feature-list">
          {COMING_SOON_FEATURES.map((feature) => (
            <li key={feature.title}>
              <p className="feature-title">{feature.title}</p>
              <p className="feature-copy">{feature.description}</p>
            </li>
          ))}
        </ul>
        <p className="modal-footnote">
          Premium categories waiting in the wings: prepared food, snack foods, sweetened beverages,
          recreational cannabis, and alcohol.
        </p>
      </Modal>

      <Modal
        isOpen={isReferencesModalOpen}
        onClose={() => setReferencesModalOpen(false)}
        title="Tax references"
      >
        <p className="modal-lead">
          Every rule in TaxSmart is based on current federal or provincial publications. Use the
          links below to verify details for your province.
        </p>
        <ul className="modal-reference-list">
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
            <a href="https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4022.html" target="_blank" rel="noreferrer">
              CRA RC4022: GST/HST supplies (taxable, zero-rated, and exempt)
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
      </Modal>

      {notice && (
        <div role="status" aria-live="polite" className="calculator-notice">
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
                <p className="rate-value">{formatPercent(TAX_RATES[province].gst)}</p>
              </div>
              <div className="rate-card">
                <p className="muted">Provincial ({provincialLabel})</p>
                <p className="rate-value">{provincialRate ? formatPercent(provincialRate) : '—'}</p>
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
                  {CATEGORY_OPTIONS.map((option) => {
                    const premium = isPremiumCategory(option)
                    return (
                      <option key={option} value={option} disabled={premium}>
                        {option}
                        {premium ? ' (Coming soon)' : ''}
                      </option>
                    )
                  })}
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
            <button type="button" className="btn primary" onClick={handleCalculate}>
              Calculate tax
            </button>
          </div>
          <p className="line-items-note" role="note">
            Custom multi-item presets arrive with premium. Edit any row above or use a preset to
            add essentials.
          </p>
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
          <h2 className="panel-title">Need help or have ideas?</h2>
          <p>
            Spot a rate mismatch, want a new feature, or need a second set of eyes on your numbers?
            Reach us at the address below and we’ll get back within one business day.
          </p>
          <div className="contact-email-group">
            <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <button type="button" className="btn ghost btn-copy-email" onClick={handleCopyEmail}>
              Copy
            </button>
            {emailNotice && (
              <span className="email-notice" role="status">{emailNotice}</span>
            )}
          </div>
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
      </footer>
    </div>
  )
}
