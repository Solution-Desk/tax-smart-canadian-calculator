import { fmtCAD } from '../../../lib/money';
import type { LineItem } from '../hooks/useTaxCalculations';

export default function LineItems({
  items, 
  onAdd, 
  onUpdate, 
  onRemove 
}: {
  items: LineItem[];
  onAdd: () => void;
  onUpdate: (id: string, changes: Partial<LineItem>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <section className="ts-card">
      <div className="ts-row between">
        <h2 className="ts-h2">Items</h2>
        <button className="btn primary" onClick={onAdd}>Add item</button>
      </div>

      <div className="ts-list">
        {items.map(it => (
          <div key={it.id} className="ts-row item">
            <input
              className="ts-input grow"
              placeholder="Label (optional)"
              value={it.label ?? ''}
              onChange={e => onUpdate(it.id, { label: e.target.value })}
            />
            <input
              className="ts-input amt"
              type="number"
              inputMode="decimal" 
              step="0.01"
              placeholder="0.00"
              value={isFinite(it.amount) ? it.amount : 0}
              onFocus={e => e.currentTarget.select()}
              onChange={e => onUpdate(it.id, { amount: Number(e.target.value) })}
            />
            <label className="ts-check">
              <input
                type="checkbox"
                checked={it.taxable !== false}
                onChange={e => onUpdate(it.id, { taxable: e.target.checked })}
              />
              Taxable
            </label>
            <button 
              className="btn ghost" 
              onClick={() => onRemove(it.id)}
              aria-label="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="ts-empty">No items yet. Add one to start.</p>
        )}
      </div>

      <div className="ts-row hint">
        <span>Tip: non-taxable items still count toward subtotal ({fmtCAD(0)} → taxes 0)</span>
      </div>
    </section>
  );
}
