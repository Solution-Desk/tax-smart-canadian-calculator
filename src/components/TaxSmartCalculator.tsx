import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { encodeState, extractStateFromHash } from '../lib/share';
import {
  CATEGORY_OPTIONS,
  Category,
  DEFAULT_PROVINCE,
  PREMIUM_CATEGORIES,
  PROVINCES,
  Province,
  TAX_RATES,
  getProvincialLabel,
} from '../lib/taxData';
import { calculateTotals, LineItemInput, validateCategory } from '../lib/taxCalculator';
import { usePremium } from '../hooks/usePremium';
import './TaxSmartCalculator.css';

type LineItemForm = {
  id: string;
  label: string;
  category: Category;
  amount: string;
};

const CURRENCY = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});

const PREMIUM_SET = new Set(PREMIUM_CATEGORIES);

function generateId(): string {
  const cryptoApi = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }
  return `item-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function createLineItem(index: number, overrides: Partial<LineItemForm> = {}): LineItemForm {
  return {
    id: overrides.id ?? generateId(),
    label: overrides.label ?? `Item ${index}`,
    category: overrides.category ?? 'Standard',
    amount: overrides.amount ?? '',
  };
}

function parseAmount(raw: string): number {
  if (!raw.trim()) return 0;
  const normalised = raw.replace(/,/g, '').trim();
  const value = Number(normalised);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function formatCurrency(value: number): string {
  return CURRENCY.format(value);
}

function formatAmountField(raw: string): string {
  const value = parseAmount(raw);
  if (value === 0) return '';
  const formatted = value.toFixed(2);
  return formatted.replace(/\.00$/, '');
}

function toShareState(items: LineItemForm[]) {
  return items.map((item) => ({
    label: item.label,
    category: item.category,
    amount: item.amount || '0',
  }));
}

async function copyText(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (error) {
      console.warn('Clipboard write failed', error);
    }
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const result = document.execCommand('copy');
  document.body.removeChild(textarea);
  return result;
}

export default function TaxSmartCalculator() {
  const [province, setProvince] = useState<Province>(DEFAULT_PROVINCE);
  const [items, setItems] = useState<LineItemForm[]>([createLineItem(1)]);
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isPremium } = usePremium();

  const showMessage = useCallback((text: string) => {
    setMessage(text);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setMessage(null);
      messageTimeoutRef.current = null;
    }, 2400);
  }, []);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const applySharedState = useCallback(() => {
    if (typeof window === 'undefined') return;
    const shared = extractStateFromHash(window.location.hash);
    if (!shared) return;

    setProvince(shared.province);

    let strippedPremium = false;

    setItems(() => {
      if (shared.items.length === 0) {
        return [createLineItem(1)];
      }

      return shared.items.map((entry, index) => {
        const category = validateCategory(entry.category);
        if (!isPremium && PREMIUM_SET.has(category)) {
          strippedPremium = true;
          return createLineItem(index + 1, {
            label: entry.label,
            category: 'Standard',
            amount: String(entry.amount ?? ''),
          });
        }

        return createLineItem(index + 1, {
          label: entry.label,
          category,
          amount: String(entry.amount ?? ''),
        });
      });
    });

    if (strippedPremium) {
      showMessage('Premium-only categories were replaced with Standard rates.');
    }
  }, [isPremium, showMessage]);

  useEffect(() => {
    applySharedState();
    if (typeof window === 'undefined') return;
    const handler = () => applySharedState();
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [applySharedState]);

  const lineInputs = useMemo<LineItemInput[]>(() => {
    return items.map((item) => ({
      amount: parseAmount(item.amount),
      category: item.category,
    }));
  }, [items]);

  const { lines, totals } = useMemo(() => calculateTotals(lineInputs, province), [lineInputs, province]);

  const lineBreakdown = useMemo(() => {
    return lines.map((line, index) => ({
      form: items[index],
      breakdown: line,
    }));
  }, [items, lines]);

  const shareState = useMemo(
    () => ({
      province,
      items: toShareState(items),
    }),
    [items, province],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const { origin, pathname, search } = window.location;
    const hash = encodeState(shareState);
    return `${origin}${pathname}${search}#${hash}`;
  }, [shareState]);

  const handleAddItem = useCallback(() => {
    setItems((prev) => [...prev, createLineItem(prev.length + 1)]);
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.length > 0 ? next : [createLineItem(1)];
    });
  }, []);

  const handleUpdateItem = useCallback((id: string, changes: Partial<LineItemForm>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  }, []);

  const handleCopyShareLink = useCallback(async () => {
    if (!shareUrl) {
      showMessage('Share link is not available yet.');
      return;
    }

    const shared = {
      title: 'TaxSmart calculation',
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shared);
        showMessage('Share dialog opened.');
        return;
      } catch (error) {
        console.warn('Native share failed', error);
      }
    }

    const ok = await copyText(shareUrl);
    showMessage(ok ? 'Share link copied to clipboard.' : 'Unable to copy share link.');
  }, [shareUrl, showMessage]);

  const handleCopyTotals = useCallback(async () => {
    const label = getProvincialLabel(TAX_RATES[province].kind);
    const summary = [
      `Province: ${province}`,
      `Subtotal: ${formatCurrency(totals.subTotal)}`,
      `Federal tax: ${formatCurrency(totals.federal)}`,
      totals.hst > 0
        ? `HST: ${formatCurrency(totals.hst)}`
        : `Provincial tax (${label}): ${formatCurrency(totals.provincial)}`,
      `Total tax: ${formatCurrency(totals.tax)}`,
      `Grand total: ${formatCurrency(totals.grandTotal)}`,
    ].join('\n');

    const ok = await copyText(summary);
    showMessage(ok ? 'Totals copied to clipboard.' : 'Unable to copy totals.');
  }, [province, totals, showMessage]);

  return (
    <div className="tax-smart">
      <header className="tax-smart__header">
        <div className="tax-smart__brand">
          <span className="tax-smart__logo" aria-hidden>
            CA
          </span>
          <div>
            <p className="tax-smart__title">TaxSmart</p>
            <p className="tax-smart__subtitle">Canadian sales tax calculator</p>
          </div>
        </div>
        <div className="tax-smart__header-actions">
          <button type="button" className="tax-smart__button ghost" onClick={handleCopyShareLink}>
            Share
          </button>
          <button type="button" className="tax-smart__button" onClick={handleCopyTotals}>
            Copy totals
          </button>
        </div>
      </header>

      {message ? <div className="tax-smart__message">{message}</div> : null}

      <main className="tax-smart__grid">
        <section className="tax-smart__panel">
          <header className="tax-smart__panel-head">
            <h2>Province</h2>
          </header>
          <label className="tax-smart__field">
            <span>Province / territory</span>
            <select
              value={province}
              onChange={(event) => setProvince(event.target.value as Province)}
            >
              {PROVINCES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </label>
        </section>

        <section className="tax-smart__panel">
          <header className="tax-smart__panel-head">
            <h2>Line items</h2>
            <button type="button" className="tax-smart__button ghost" onClick={handleAddItem}>
              Add item
            </button>
          </header>

          <div className="tax-smart__items">
            {items.map((item, index) => {
              const premium = PREMIUM_SET.has(item.category);
              const disabled = premium && !isPremium;
              return (
                <div key={item.id} className="tax-smart__row">
                  <label className="tax-smart__input">
                    <span className="tax-smart__input-label">Label</span>
                    <input
                      value={item.label}
                      onChange={(event) =>
                        handleUpdateItem(item.id, { label: event.target.value })
                      }
                      placeholder={`Item ${index + 1}`}
                    />
                  </label>

                  <label className="tax-smart__input">
                    <span className="tax-smart__input-label">Category</span>
                    <select
                      value={item.category}
                      onChange={(event) => {
                        const next = validateCategory(event.target.value);
                        handleUpdateItem(item.id, { category: next });
                      }}
                    >
                      {CATEGORY_OPTIONS.map((option) => (
                        <option key={option} value={option} disabled={!isPremium && PREMIUM_SET.has(option)}>
                          {option}
                          {!isPremium && PREMIUM_SET.has(option) ? ' (Premium)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="tax-smart__input">
                    <span className="tax-smart__input-label">Amount</span>
                    <input
                      inputMode="decimal"
                      value={item.amount}
                      placeholder="0.00"
                      onChange={(event) =>
                        handleUpdateItem(item.id, { amount: event.target.value })
                      }
                      onBlur={(event) =>
                        handleUpdateItem(item.id, { amount: formatAmountField(event.target.value) })
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className="tax-smart__remove"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Remove ${item.label || `item ${index + 1}`}`}
                  >
                    ×
                  </button>

                  {disabled ? (
                    <p className="tax-smart__hint">
                      Premium categories are disabled. Visit the Pro page to unlock them.
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section className="tax-smart__panel tax-smart__panel--totals">
          <header className="tax-smart__panel-head">
            <h2>Totals</h2>
          </header>
          <dl className="tax-smart__totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(totals.subTotal)}</dd>
            </div>
            <div>
              <dt>Federal (GST)</dt>
              <dd>{formatCurrency(totals.federal)}</dd>
            </div>
            {totals.hst > 0 ? (
              <div>
                <dt>HST</dt>
                <dd>{formatCurrency(totals.hst)}</dd>
              </div>
            ) : (
              <div>
                <dt>
                  Provincial ({getProvincialLabel(TAX_RATES[province].kind)})
                </dt>
                <dd>{formatCurrency(totals.provincial)}</dd>
              </div>
            )}
            <div>
              <dt>Total tax</dt>
              <dd>{formatCurrency(totals.tax)}</dd>
            </div>
            <div className="tax-smart__totals-strong">
              <dt>Grand total</dt>
              <dd>{formatCurrency(totals.grandTotal)}</dd>
            </div>
          </dl>
        </section>

        <section className="tax-smart__panel tax-smart__panel--breakdown">
          <header className="tax-smart__panel-head">
            <h2>Line breakdown</h2>
          </header>
          {lineBreakdown.length === 0 ? (
            <p className="tax-smart__empty">Add an item to see the breakdown.</p>
          ) : (
            <div className="tax-smart__table">
              <div className="tax-smart__table-head">
                <span>Label</span>
                <span>Category</span>
                <span>Amount</span>
                <span>Tax</span>
                <span>Total</span>
              </div>
              <div className="tax-smart__table-body">
                {lineBreakdown.map(({ form, breakdown }) => (
                  <div key={form.id} className="tax-smart__table-row">
                    <span>{form.label || '—'}</span>
                    <span>{form.category}</span>
                    <span>{formatCurrency(breakdown.amount)}</span>
                    <span>{formatCurrency(breakdown.totalTax)}</span>
                    <span>{formatCurrency(breakdown.grandTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
